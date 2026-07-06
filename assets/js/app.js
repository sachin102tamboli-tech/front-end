const cl= console.log

const postForm = document.getElementById('postForm')
const addBtn = document.getElementById('addPost')
const updtBtn = document.getElementById('updtPost')
const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userId = document.getElementById('userId')
const postContainer = document.getElementById('postContainer')
const spinner = document.getElementById('spinner')
const author = document.getElementById('author')

let baseUrl = "https://server2-gold-five.vercel.app";
let postUrl = `${baseUrl}/blogs`

let postArr = []
function snackbar(msg,icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

function fetchPost(ele){
    fetch(postUrl, {
        method :'GET',
        headers : {
            'content-type' : 'application/json'
            
        }
    })
    .then(res=>{
        
            return res.json()
        
    })
    .then(res1=>{
        createCards(res1.data)
       
    })
    .catch(err =>{
        snackbar(err,'error')
    })
    .finally()
}
fetchPost()

function createCards(arr){
    let result = '';
   
    arr.forEach(obj =>{
        result += ` 
                        <div class="col-md-4 mb-3" id= "${obj.id}">
                            <div class="card ">
                                <div class="card-header">
                                    <h3>${obj.title}</h3>
                                </div>
                                <div class="card-body">
                                    <p>${obj.content}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <button class="btn btn-sm btn-outline-primary" onClick="onEdit(this)">Edit</button>
                                    <button class="btn btn-sm btn-outline-danger" onClick="onRemove(this)">Remove</button>
                                </div>
                            </div>
                        </div>
                        `
    })
    postContainer.innerHTML = result;
}

function onsubmit(eve){
    eve.preventDefault()
     spinner.classList.remove('d-none')
    let obj = {
        title : titleControl.value,
        content : bodyControl.value,
      }

    fetch(postUrl, {
        method : "POST",
        body : JSON.stringify(obj),
        headers : {
            'content-type' : 'application/json',
            'Authorization' : 'get-your-token'
        }
    })
    .then(res=>{
       
         return res.json()
      
    })
    .then(res=>{
        createCard(res.data)
        console.log(res.data)
        snackbar('Record Added Succesfully','success')
    })
    .catch(err=>{

        snackbar(err,'error') 
    })
    .finally(()=>{
        spinner.classList.add('d-none')
    })
}

function createCard(data){
    let div = document.createElement('div')
    div.id = data.id
    div.className= "col-md-4 mb-3"
    div.innerHTML = `<div class="card ">
                                <div class="card-header">
                                    <h3>${data.title}</h3>
                                </div>
                                <div class="card-body">
                                    <p>${data.content}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <button class="btn btn-sm btn-outline-primary" onClick= "onEdit(this)">Edit</button>
                                    <button class="btn btn-sm btn-outline-danger" onClick= "onRemove(this)">Remove</button>
                                </div>
                            </div>`
                            postContainer.prepend(div)
                            postForm.reset()
}

function onEdit(ele){
    let editId = ele.closest(".col-md-4").id
    spinner.classList.remove('d-none')
    localStorage.setItem('editId',editId)

    let editUrl = `${postUrl}/${editId}`

    fetch(editUrl,{
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            
        }
    })
    .then(res =>{
        if(res.ok){
            return res.json()
        }else{
            throw new Error()
        }
    })
    .then(res1=>{
        fetchOnUi(res1.data)
    })
    .catch(err=>{
        snackbar(err,'error')
    })
    .finally(()=>{
        spinner.classList.add('d-none')
    })
}

function fetchOnUi(res){
    localStorage.getItem('editId')

    titleControl.value = res.title;
    bodyControl.value = res.content;
    
    
    addBtn.classList.add('d-none')
    updtBtn.classList.remove('d-none')
    postForm.scrollIntoView({
        behavior : "smooth",
        block : 'start'
    })
}
function onUpdate(ele){
    // spinner.classList.remove('d-none')
    let updateId = localStorage.getItem('editId')
    let updatedObj = {
        title : titleControl.value,
        content : bodyControl.value
        
    }

    let updatedUrl = `${postUrl}/${updateId}`

    fetch(updatedUrl,{
        method : "PATCH",
        body : JSON.stringify(updatedObj),
        headers : {
            'content-type' : 'application/json',
            'Authorization' : 'get-your-token'
        }
    })

    .then(res=>{
        if(res.ok){
            return res.json()
        }else {
            throw new Error()
       }
})
    .then(()=>{
        updateOnui(updatedObj)
        snackbar('Record Updated Succesfully','success')
    })
    .catch(err=>{
        snackbar(err,'error')

    })
    .finally(()=>{
        spinner.classList.add('d-none')
    })
}

function updateOnui(res){
    let updatedId = localStorage.getItem('editId')

    let li = document.getElementById(updatedId)
   
    li.innerHTML = `<div class="card ">
                                <div class="card-header">
                                    <h3>${res.title}</h3>
                                </div>
                                <div class="card-body">
                                    <p>${res.content}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <button class="btn btn-sm btn-outline-primary" onClick= "onEdit(this)">Edit</button>
                                    <button class="btn btn-sm btn-outline-danger" onClick= "onRemove(this)">Remove</button>

                            </div>`

                    addBtn.classList.remove('d-none')
                    updtBtn.classList.add('d-none')  
                    postForm.reset() 
                    li.scrollIntoView({
                        behavior : "smooth",
                        block : 'center'
    
                    })

}

function onRemove(ele){
    let removeId = ele.closest(".col-md-4").id;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    localStorage.setItem('removeId',removeId)
    spinner.classList.remove('d-none')
    let removeUrl = `${postUrl}/${removeId}`

    fetch(removeUrl, {
        method : "DELETE",
        headers :{
            'ontent-type' : 'application/json',
            'Authorization' : 'get-your-token'
        }
    })
    .then(res=>{
        if(res.ok){
            return res.json()
        }else{
            throw new Error()
        }
    })
    .then(data=> {
        document.getElementById(removeId).remove()
        snackbar('Record Deleted Succesfully','success')
    })
    .catch(err=>{
        snackbar(err,"error")
    })
    .finally(()=>{
        spinner.classList.add('d-none')
    })
  }
});
    
}

// function removeOnUi(res){
//     let removeId = localStorage.getItem("removeId")

//     document.getElementById(removeId).remove()
// }

postForm.addEventListener('submit', onsubmit)
updtBtn.addEventListener('click', onUpdate)