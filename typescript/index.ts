// Object: index.ts file

function hendleLogIn(ev:any){
    try {
        ev.preventDefault();
        const username=ev.target.username.value;
        if(!username){
          throw new Error("cant find username");
        }else{
            // save username in local storage
            localStorage.setItem('username',username);
            // redirect to chat page
            window.location.href = 'canvas.html';
        }
    } catch (error) {
        console.error(error);
    }
   
}
function showScoreboard(){
    window.location.href = 'scoreboard.html';
}
const cursorShadow = document.getElementById("cursorShadow");

    // Update the cursor shadow position on mousemove
    document.addEventListener("mousemove", (event) => {
        const { clientX, clientY } = event;
        cursorShadow.style.left = `${clientX}px`;
        cursorShadow.style.top = `${clientY}px`;
    });
