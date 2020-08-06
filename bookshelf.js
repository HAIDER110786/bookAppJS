class myLocalStorage{

    static addBooksToStorage(book){
        let books = myLocalStorage.getBooksFromLocalStorage();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBooksFromLocalStorage(isbn){
        let books = myLocalStorage.getBooksFromLocalStorage();
        let newbooks = books.filter(book => {
            return book.isbn !== isbn;
        })
        localStorage.setItem('books',JSON.stringify(newbooks));
    }

    static getBooksFromLocalStorage(){
        let books = [];
        if(localStorage.getItem('books')!==null){
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
}

class Book{

    constructor(author,isbn,book){
        this.author=author;
        this.isbn=isbn;
        this.book=book;
    }

    displayBook(){

        if(this.validUserInput()){
            if(myLocalStorage.getBooksFromLocalStorage()==''){
                dynamicDOMtags.createTableHeader();
            }
            this.addTolocalStorage();
            this.insertIntoTheTable();
        }

    }

    addTolocalStorage(){
        myLocalStorage.addBooksToStorage({author:this.author,book:this.book,isbn:this.isbn});
    }

    insertIntoTheTable(){
        const BookShelf = document.querySelector('.BookShelf');

        const newRow = document.createElement('tr');

        newRow.innerHTML = 
        `
        <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">${this.author}</td>
        <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">${this.isbn}</td>
        <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">${this.book}</td>
        <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">
        <button class="delete_button">
        DELETE
        </button>
        </td>
        `

        BookShelf.appendChild(newRow);

        this.clearInputFields();

        Book.showingAlerts('success','your book has been added');
    }

    clearInputFields(){
        document.querySelector('#user_name').value='';
        document.querySelector('#isbn').value='';
        document.querySelector('#book_name').value='';
    }

    static deletingFromTheTable(elementToBeDeleted){

        let isbn=(elementToBeDeleted.parentElement.previousElementSibling.previousElementSibling.textContent);
        myLocalStorage.removeBooksFromLocalStorage(isbn);

        elementToBeDeleted.parentElement.parentElement.remove();

        //also the method to remove an element from an array
        // function removeElement(array, elem) {    
        //     var index = array.indexOf(elem);
        //     if (index > -1) {
        //         array.splice(index, 1);
        //     }
        // }

        Book.showingAlerts('danger','your book has been removed');
        

        if(myLocalStorage.getBooksFromLocalStorage() == ''){
            dynamicDOMtags.removeTableHeader();
        }
    }

    static showingAlerts(alertType,message){
        const alert = document.createElement('div');
        alert.className = `alert ${alertType}`;
        alert.appendChild(document.createTextNode(message));
        const mainBody = document.querySelector('body');
        const workingArea = document.querySelector('.book-adding-form').parentElement;
        mainBody.insertBefore(alert,workingArea);

        setTimeout(Book.removeAlert,1000);
    }

    static removeAlert(){
        document.querySelector('.alert').remove();  
    }

    validUserInput(){

        if(this.author==='' || this.book==='' || this.isbn===''){
            Book.showingAlerts('danger','Please fill in all the fields');
            return false;
        } 
        else
        {
            if(myLocalStorage.getBooksFromLocalStorage()!=''){
                if(myLocalStorage.getBooksFromLocalStorage().some(ind_book=>{
                    return ind_book.book == this.book;
                }))
                {
                    Book.showingAlerts('warning','This book is already in the list');
                    return false;
                }
                else if(myLocalStorage.getBooksFromLocalStorage().some(ind_book=>{
                    return ind_book.isbn == this.isbn;
                }))
                {
                    Book.showingAlerts('warning','This isbn is already in the list');
                    return false;
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return true;
            }
        }
    }
}

class dynamicDOMtags{
    static createTableHeader() {        
        const BookShelf = document.querySelector('.BookShelf');

        const newRow = document.createElement('tr');
        newRow.className = 'tableHeader';

        newRow.innerHTML = 
        `
        <th style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px">AUTHOR</th>
        <th style="width:214px;border:2px solid rgb(32, 124, 167)">ISBN</th>
        <th style="width:214px;border:2px solid rgb(32, 124, 167)">BOOK NAME</th>
        <th style="width:214px;border:2px solid rgb(32, 124, 167)">DELETE_BOOK</th>
        `

        BookShelf.appendChild(newRow);
    }
    
    static removeTableHeader(){
        document.querySelector('.tableHeader').remove();
    }
}

document.querySelector('.book-adding-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const author = document.querySelector('#user_name').value;
    const isbn = document.querySelector('#isbn').value;
    const book = document.querySelector('#book_name').value;
    const newBook = new Book(author,isbn,book);
    newBook.displayBook();
})

document.querySelector('.BookShelf').addEventListener('click',(e)=>{
    if(e.target.classList.contains('delete_button')){
        Book.deletingFromTheTable(e.target);
    }
})

document.addEventListener('DOMContentLoaded',(e)=>{
    if(myLocalStorage.getBooksFromLocalStorage()!=''){
        dynamicDOMtags.createTableHeader();
        let yo=myLocalStorage.getBooksFromLocalStorage();
        yo.forEach(individual_book=>{
            const BookShelf = document.querySelector('.BookShelf');

            const newRow = document.createElement('tr');
    
            newRow.innerHTML = 
            `
            <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">${individual_book.author}</td>
            <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">${individual_book.isbn}</td>
            <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">${individual_book.book}</td>
            <td style="width:214px;border:2px solid rgb(32, 124, 167);padding:10px;text-align:center">
            <button class="delete_button">
            DELETE
            </button>
            </td>
            `
    
            BookShelf.appendChild(newRow);
        })
    }
})