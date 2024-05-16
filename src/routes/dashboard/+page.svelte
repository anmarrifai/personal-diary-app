<script>
    import { onMount, onDestroy } from 'svelte';
    import { db, auth } from '../../lib/firebase.js';
    import { authHandlers, authStore } from "../../store/store.js";
    import { collection, onSnapshot, doc, setDoc,deleteDoc } from 'firebase/firestore';
    import DiaryItem from '../components/DiaryItem.svelte';
    import Modal from '../components/Modal.svelte';

    let diaryEntries = {};
    let currdiary = "";
    let error = false;
    let unsubscribeDiaries; // To hold the unsubscribe function
    let authSubscription;
    let showModal = false;
    let modalContent = '';
    let editingDate = null;
    let editingIndex = null;
    let expandedDate = null;

function toggleDate(date) {
    expandedDate = expandedDate === date ? null : date;
}
    // This function subscribes to real-time updates of diary entries
    function subscribeToDiaries(userId) {
        const diaryCollection = collection(db, "users", userId, "diaries");
        return onSnapshot(diaryCollection, (querySnapshot) => {
            let updates = {};
            querySnapshot.forEach((doc) => {
                updates[doc.id] = doc.data().entries;
            });
            diaryEntries = updates;  // This will update the UI reactively
        }, (error) => {
            console.error("Error fetching diaries: ", error);
        });
    }

    onMount(() => {
        authSubscription = authStore.subscribe($authStore => {
            if ($authStore.user && !unsubscribeDiaries) {
                unsubscribeDiaries = subscribeToDiaries($authStore.user.uid);
            } else if (!$authStore.user && unsubscribeDiaries) {
                unsubscribeDiaries(); // Unsubscribe when there is no user
                unsubscribeDiaries = null;
                diaryEntries = {}; // Optionally clear diary entries
            }
        });

       
    });
    onDestroy(() => {
            if (unsubscribeDiaries) {
                unsubscribeDiaries(); // Ensure we clean up listeners
            }
            if (authSubscription) {
                authSubscription(); // Unsubscribe from auth store changes
            }
        });
    function addDiary() {
        const entryDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        error = false;

        if (!currdiary) {
            error = true;
        } else {
            if (!diaryEntries[entryDate]) {
                diaryEntries[entryDate] = [];
            }
            diaryEntries[entryDate].push({
                time: new Date().toISOString(), // Full timestamp
                text: currdiary
            });

            try {
                const diaryRef = doc(db, "users", auth.currentUser.uid, "diaries", entryDate);
                setDoc(diaryRef, { entries: diaryEntries[entryDate] }, { merge: true });
            } catch (err) {
                console.error("Error updating diary: ", err);
            }

            currdiary = "";
        }
    }

    async function removeDiary(date, index) {
    if (diaryEntries[date] && index >= 0 && index < diaryEntries[date].length) {
        diaryEntries[date].splice(index, 1); // Removes the entry locally
        
        if (diaryEntries[date].length === 0) {
            // If no entries are left for the date, delete the Firestore document
            const diaryRef = doc(db, "users", auth.currentUser.uid, "diaries", date);
            await deleteDoc(diaryRef);
            delete diaryEntries[date]; // Also remove the key from the local state
        } else {
            // Otherwise, just update the Firestore document with the remaining entries
            const diaryRef = doc(db, "users", auth.currentUser.uid, "diaries", date);
            await setDoc(diaryRef, { entries: diaryEntries[date] }, { merge: true });
        }
    }
}
function editDiary(date, index) {
    openModal(date, index);
}
    
function openModal(date, index) {
        editingDate = date;
        editingIndex = index;
        modalContent = diaryEntries[date][index].text;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    function saveEditedDiary(newContent) {
        if (editingDate != null && editingIndex != null && diaryEntries[editingDate] && editingIndex >= 0 && editingIndex < diaryEntries[editingDate].length) {
            diaryEntries[editingDate][editingIndex].text = newContent;
            const diaryRef = doc(db, "users", auth.currentUser.uid, "diaries", editingDate);
            setDoc(diaryRef, { entries: diaryEntries[editingDate] }, { merge: true }).then(() => {
                closeModal();
            });
        }
    }
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
 <!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="mainContainer">
    <div class="headerContainer">
        <h1>Diary List</h1>
        <div class="headerBtns">
           
            <button on:click={() => auth.signOut()}>
                <i class="fa-solid fa-right-from-bracket" />
                <p>Logout</p>
            </button>
        </div>
    </div>
    <main>
        {#each Object.keys(diaryEntries) as date}
        <div class="dateGroup" on:click={() => toggleDate(date)}>
            <h2>{date} ({diaryEntries[date].length} entries)</h2>
            {#if expandedDate === date}
                {#each diaryEntries[date] as diary, index}
                    <DiaryItem {diary} {index} {date} removeDiary={removeDiary} editDiary={editDiary} />
                {/each}
            {/if}
        </div>
        {/each}
    </main>
    <div class={"enterDiary " + (error ? "errorBorder" : "")}>
        <input bind:value={currdiary} type="text" placeholder="Enter Diary" />
        <button on:click={addDiary}>ADD</button>
    </div>
</div>
<Modal {showModal} {modalContent} onSave={saveEditedDiary} onClose={closeModal} />

<style>
    .mainContainer{
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        gap: 24px;
        padding: 24px;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
    }
    .headerContainer{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .headerBtns {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    main{
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex:1;
    }
    .errorBorder {
        border-color: coral !important;
    }
    .dateGroup {
    cursor: pointer;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.dateGroup:hover {
    background-color: #747373;
}

.dateGroup h2 {
    user-select: none; /* Prevents text selection */
}
    .enterDiary{
        display: flex;
        align-items: stretch;
        border: 1px solid #0891b2;
        border-radius: 5px;
        overflow: hidden;
    }
    .enterDiary input{
        background: transparent;
        border: none;
       padding: 14px;
       color: white;
       flex: 1;
    }
    .enterDiary input:focus{
        outline: none;
    }
    .enterDiary button{
        padding: 0 14px;
        background: #003c5b;
        border: none;
        color: cyan;
        font-weight: 600;
    }
    .enterDiary button:hover{
        background:#4996bd ;
        transition: all 200ms ease-in-out;
    }
    
    .headerContainer button{
        display: flex;
        align-items: center;
        gap:10px;
        padding: 10px 18px;
        background: #003c5b;
        border: none;
        color: white;
        font-weight: 600;  
        font-size:medium;
        border-radius: 4px;
    }
    .headerContainer button:hover{
        background:#4996bd ;
        transition: all 200ms ease-in-out;
    }
    
</style>