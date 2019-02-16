

// Storage Controller
const StorageCtrl = (function(){
    // Public methods
    return {
      storeItem: function(item){
        let items;
        // Check if any items in ls
        if(localStorage.getItem('items') === null){
          items = [];
          // Push new item
          items.push(item);
          // Set ls
          localStorage.setItem('items', JSON.stringify(items));
        } else {
          // Get what is already in ls
          items = JSON.parse(localStorage.getItem('items'));
  
          // Push new item
          items.push(item);
  
          // Re set ls
          localStorage.setItem('items', JSON.stringify(items));
        }
      },
      getItemsFromStorage: function(){
        let items;
        if(localStorage.getItem('items') === null){
          items = [];
        } else {
          items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
      },
      updateItemStorage: function(updatedItem){
        let items = JSON.parse(localStorage.getItem('items'));
  
        items.forEach(function(item, index){
          if(updatedItem.id === item.id){
            items.splice(index, 1, updatedItem);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },
      deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'));
        
        items.forEach(function(item, index){
          if(id === item.id){
            items.splice(index, 1);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },
      clearItemsFromStorage: function(){
        localStorage.removeItem('items');
      }
    }
  })();
  


// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  
    // Data Structure / State
    const data = {
      // items: [
      //   // {id: 0, name: 'Steak Dinner', calories: 1200},
      //   // {id: 1, name: 'Cookie', calories: 400},
      //   // {id: 2, name: 'Eggs', calories: 300}
      // ],
      items: StorageCtrl.getItemsFromStorage(),
      currentItem: null,
      totalCalories: 0
    }
  
    // Public methods
    return {
      getItems: function(){
        return data.items;
      },
      addItem: function(name, calories){
        let ID;
        // Create ID
        if(data.items.length > 0){
          ID = data.items[data.items.length - 1].id + 1;
        } else {
          ID = 0;
        }
  
        // Calories to number
        calories = parseInt(calories);
  
        // Create new item
        newItem = new Item(ID, name, calories);
  
        // Add to items array
        data.items.push(newItem);
  
        return newItem;
      },
      getItemById: function(id){
        let found = null;
        // Loop through items
        data.items.forEach(function(item){
          if(item.id === id){
            found = item;
          }
        });
        return found;
      },
      updateItem: function(name, calories){
        // Calories to number
        calories = parseInt(calories);
  
        let found = null;
  
        data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
            item.name = name;
            item.calories = calories;
            found = item;
          }
        });
        return found;
      },
      deleteItem: function(id){
        // Get ids
        const ids = data.items.map(function(item){
          return item.id;
        });
  
        // Get index
        const index = ids.indexOf(id);
  
        // Remove item
        data.items.splice(index, 1);
      },
      clearAllItems: function(){
        data.items = [];
      },
      setCurrentItem: function(item){
        data.currentItem = item;
      },
      getCurrentItem: function(){
        return data.currentItem;
      },
      getTotalCalories: function(){
        let total = 0;
  
        // Loop through items and add cals
        data.items.forEach(function(item){
          total += item.calories;
        });
  
        // Set total cal in data structure
        data.totalCalories = total;
  
        // Return total
        return data.totalCalories;
      },
      logData: function(){
        return data;
      }
    }
  })();
  

//ui controller
const UICtrl = (function(){
    const UISelectors= {
        itemList:'#item-list',
        addBtn:'.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories : '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.remove-btn',
        backBtn : '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'

    }
    return{
        populateItemsList: function(items){
            let html = '';

            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}" >
                ${item.name}
            <em>${item.calories}</em>
              <a class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
              </a>
                </li>`;
               
            });
             document.querySelector(UISelectors.itemList).innerHTML= html;
                

        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //showlist
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li= document.createElement('li');
            //add class
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML=`
            ${item.name}
            <em>${item.calories}</em>
              <a class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
              </a>
            `;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn node list into arr
            listItems = Array.from(listItems);
            //loop trhough
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    ${item.name}
                    <em>${item.calories}</em>
                      <a class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                      </a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearFields: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories; 
        },
        clearEditState: function(){
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
        
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        addEditState: function(){
            
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
    
        getSelectors: function(){
            return UISelectors;
        }
        
    }
})();


//app controller

const App = (function(ItemCtrl, UICtrl, StorageCtrl){
    //load event listener
    const loadEventListeners = function (){
        //get UI selectors
        const UISelectors = UICtrl.getSelectors();
        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click",
        itemAddSubmit);
        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click",
        itemEditClick);
        
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
        //back btn
        document.querySelector(UISelectors.backBtn).addEventListener("click",
        UICtrl.clearEditState);
        //delete btn
        document.querySelector(UISelectors.deleteBtn).addEventListener("click",
        itemDeleteSubmit);
        //clear btn
        document.querySelector(UISelectors.clearBtn).addEventListener("click",
        clearAllItemsClick);
          document.addEventListener('keypress', function(e){
        if(e.KeyCode === 13 || e.which === 13){
            e.preventDefault();
            return false;
        }
      });
    }
    //add item submit

    const itemAddSubmit = function(e){
        // get form input from UI controller
        const input = UICtrl.getItemInput();
        //check for names and calories
        if(input.name !== '' && input.calories !== ''){
            //add item to the list
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add item to UI
            UICtrl.addListItem(newItem);
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //store in local storage
            StorageCtrl.storeItem(newItem);
             //clear fields
             UICtrl.clearFields();
        }

        e.preventDefault();
    }

        //update item submit
     const  itemEditClick = function(e){
         if(e.target.classList.contains('edit-item')){
            //get list item id
            const listId = e.target.parentNode.parentNode.id;
            //break into an array
            const listIDArr = listId.split('-');
            console.log(listIDArr);
            //get the actual id
            const id = parseInt(listIDArr[1]);
            //get the item
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            //add item to form
            UICtrl.addItemToForm();
         }
            e.preventDefault();
        
    }
    //Item submit
    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput();
        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
         UICtrl.updateListItem( ItemCtrl.updateItem(input.name, input.calories));
         //get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //add total calories to UI
         UICtrl.showTotalCalories(totalCalories);
         //Update local Storage
         StorageCtrl.updateItemStorage(updatedItem);
         UICtrl.clearEditState();
         e.preventDefault();
    }

    const itemDeleteSubmit = function(e){
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //delet from data structure
        ItemCtrl.deleteItem(currentItem.id);
        //delete from UI
        UICtrl.deleteListItem(currentItem.id);
         //get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //add total calories to UI
         UICtrl.showTotalCalories(totalCalories);
         //delete from local storage
         StorageCtrl.deleteItemFromStorage(currentItem.id);
          //clear fields
          UICtrl.clearEditState();
        e.preventDefault();
    }
    //clear items event
    const clearAllItemsClick = function(){
        //clear all items from data structure
        ItemCtrl.clearAllItems();
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        //remove from UI
        UICtrl.removeItems();
        //clear from local storage
        StorageCtrl.clearItemsStorage();
        //hide UL
        UICtrl.hideList();
    }
    return{
        init:function(){
              //display only add btn
         UICtrl.clearEditState();
        //fetch items from data structures
        const items = ItemCtrl.getItems();  
        //call load event listener
        loadEventListeners();
        //check if items
        if(items.length === 0){
            UICtrl.hideList();
        }else{
             //populate list with items
        UICtrl.populateItemsList(items);
        }
         //get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //add total calories to UI
         UICtrl.showTotalCalories(totalCalories);
        loadEventListeners();
        }
    }
  
})(ItemCtrl, UICtrl, StorageCtrl);

//initialize app

App.init();

