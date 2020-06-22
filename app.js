/*
Criterias for creating Modules:
  + Data Encapsulation: Separation
  of Pivate Data and API, public interface.
  + Separation of Concern: Each module is
  standalone and independent component.
*/

/*************Budget Controller******************/
var budgetController = (function(){
  /*
   Object Constructors: Income
  */
  var Income = function (id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  }

  /*
   Object Constructors: Expense
  */
  var Expense = function (id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  /*
  Expense Object Prototype
  */
  Expense.prototype.calcPercentage = function () {

    if(data.totalItem.inc > 0){
      this.percentage = Math.round((this.value/data.totalItem.inc) * 100);
    } else {
      this.percentage = -1;
    }

  }

  /*
  Expense Object Prototype
  */
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

  /*
  Data structure: App Data
  Usages: To store data of individual incomes and expenses
            total incomes and expenses, and budget data
  */
  var data = {
    individualItems:{
      inc: [],
      exp: []
    },
    totalItem:{
      inc: 0,
      exp: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    /*
      Function: public data structure SETTER
      Precondition: It is called when the add event is evoked
      Postcondition: Add new items to budget data structure
                    Return new item ID
    */
    addItem: function (inputObj) {
      var id, newItem;

      //1.Create new idea
      if(data.individualItems[inputObj.type].length > 0){
        id = data.individualItems[inputObj.type]
              [data.individualItems[inputObj.type].length - 1].id + 1
      } else {
        id = 0;
      }

      //2.Create a new Income OR Expense Object
      if(inputObj.type === "inc"){
        newItem = new Income(id, inputObj.description, inputObj.value);
      } else{
        newItem = new Expense(id, inputObj.description, inputObj.value);
      }

      //3.Push new Income / Expense Object to data Structure
      data.individualItems[inputObj.type].push(newItem);

      return {
        id: id
      }
    },

    /*
      Function: Calculate Budget
      Precondition: It is called with new item info
      Postcondition: New Budget Value
    */
    calculateBudget: function () {
      var sumInc = 0;
      var sumExp = 0;
      //1. Add new item to total Inc / Exp
      data.individualItems.inc.forEach(function(item, idx, arr){
        sumInc += parseFloat(item.value);
      })
      data.totalItem.inc = sumInc;

      data.individualItems.exp.forEach(function(item, idx, arr){
        sumExp += parseFloat(item.value);
      })
      data.totalItem.exp = sumExp;

      //2. Calculate budget
      data.budget = data.totalItem.inc - data.totalItem.exp;

      //3. Calculate Budget percentages
      (data.totalItem.inc > 0) ?
          data.percentage = Math.round(data.totalItem.exp/data.totalItem.inc * 100) + "%"
          : data.percentage = "---";

    },

    /*
      Function: Calculate Percentages
      Precondition: None
      Postcondition: Update Expense Percentages
    */
    calculatePercentages: function () {

      //Calling calPercentage for all expenses
      data.individualItems.exp.forEach( function(item, idx, arr){
        item.calcPercentage();
      })

    },

    /*
      Function: Get Percentages
      Precondition: None
      Postcondition: Return An array of Expense Percentages
    */
    getPercentages: function () {
      return data.individualItems.exp.map( (item) => item.getPercentage())
    },

    /*
      Function:  Budget GETTER
      Precondition: None
      Postcondition: Return Budget Info
    */
    getBudget: function (){
      return {
        totalIncome: data.totalItem.inc,
        totalExpense: data.totalItem.exp,
        budget: data.budget,
        percentage: data.percentage
      }
    },

    /*
      Function:  Delete Income/Expense Item
      Precondition: ID of Item need to be deleted
      Postcondition: Updated Budget
    */
    deleteItem: function(type,id){
      var ids = [];
      var index;

      //1. Get IDs array
      ids = data.individualItems[type].map(function (item) {
        return item.id;
      });

      //2. Get Index of deleted Item
      index = ids.indexOf(id);

      //3. Update the array
      if (index !== -1) {
      data.individualItems[type].splice(index,1);
      }

    },

    /*
      Function: Testing
      Precondition: None
      Postcondition: Display internal budget data
    */
    testing: function (){
      return data;
    }
  }
})();

/*************UI Controller******************/
var UIController = (function(){
  /*Data Structure: DOM Strings
    Usage: To store names of all DOM strings
  */
  var DOMStrings = {
    add__btn: ".add__btn",
    add__value: ".add__value",
    add__description: ".add__description",
    add__type: ".add__type",
    income__list: ".income__list",
    expense__list: ".expenses__list",
    budget__value: ".budget__value",
    budget__income__value: ".budget__income--value",
    budget__expenses__value: ".budget__expenses--value",
    budget__expenses__percentage: ".budget__expenses--percentage",
    item: ".item",
    item__delete__btn: "item__delete__btn",
    container: ".container",
    item__percentage: ".item__percentage",
    budget__title__month: ".budget__title--month",
    add__type: ".add__type"
  }

  /*Function: Format Number
    Precondition: A number
    Postcondition: A string in this format: + 1,200.00
  */
  var formatNumber = function (num, type) {

    let numArr = [], numString = "", sign;

    // Getting Sign
    type === "inc" ? sign = "+" : sign = "-";

    // Formating num
    num = num.toFixed(2);

    numArr = num.split(".");

    for (var i = numArr[0].length; i > 3; i-=3) {
      numString = ","+ numArr[0].substring(i-3, i) + numString;
    }

    numString = numArr[0].substring(0, i) + numString;

    //Forming String
    return sign + " " +numString + "." + numArr[1];
  }

  return {
    /*Function: Input Value SETTER
      Precondition: It is called when the event is evoked
      Postcondition: Return user value of the input
    */
    getInput: function () {
      return {
        value: document.querySelector(DOMStrings.add__value).value,
        description: document.querySelector(DOMStrings.add__description).value,
        type: document.querySelector(DOMStrings.add__type).value
      }
    },

    /*Function: DOM Strings GETTER
      Precondition: It is called by functions in other Modules
                    to get exact name
                    of the DOM selector
      Postcondition: Return an DOM String Object
    */
    getDOMStrings: function () {
      return DOMStrings;
    },

    /*Function: Change HTML content for Expense and Income List
      Precondition: It is called when click or keypress event is evoked
      Postcondition: New items are added to HTML content
    */
    addListItem: function(id, inputObj){
      var html, element;

      //1. Create HTML template for new items
      if(inputObj.type === "inc"){
        element = DOMStrings.income__list;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> ';
      } else {
        element = DOMStrings.expense__list;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //2. Replace id, description, and value with value of inputValueObj
      html = html.replace("%id%", id);
      html = html.replace("%description%", inputObj.description);
      html = html.replace("%value%", formatNumber(parseFloat(inputObj.value),inputObj.type));

      //3. Add html variable to HTML content
      document.querySelector(element)
              .insertAdjacentHTML("beforeend", html);
    },

    /*Function: Change HTML content for Expense and Income List
      Precondition: It is called when input value is already added
                    to App data structure and to HTML content
      Postcondition: Clear Input Fields
    */
    clearFields: function(){
      var inputFields;
      //1. Select HTML input elements
      inputFields = document.querySelectorAll(DOMStrings.add__description + "," + DOMStrings.add__value);

      //2. Turn the lists to Array
      inputFields = Array.prototype.slice.call(inputFields);

      //3. Set the value of input Field to zero
      inputFields.forEach(function (current, index, array){
        current.value = "";
      });
    },

    /*Function: Update Budget UI
      Precondition: It is called to update Budget UI as new item is added
      Postcondition: Updated Budget UI
    */
    displayBudget: function(budgetObj){
      let type;

      budgetObj.budget >= 0 ? type = "inc" : type = "exp";

      document.querySelector(DOMStrings.budget__value).textContent = formatNumber(budgetObj.budget, type);
      document.querySelector(DOMStrings.budget__income__value).textContent = formatNumber(budgetObj.totalIncome, "inc");
      document.querySelector(DOMStrings.budget__expenses__value).textContent = formatNumber(budgetObj.totalExpense, "exp");
      document.querySelector(DOMStrings.budget__expenses__percentage).textContent = budgetObj.percentage;
    },

    /*Function: Delete List Item
      Precondition: It is called when delete event is clicked
      Postcondition: Updated Income / Expense List
    */
    deleteListItem: function(id){

      var el = document.getElementById(id);

      el.parentNode.removeChild(el);

    },

    /*Function: Display percentages
      Precondition: An Array of Percentages
      Postcondition: Update Individual Expense Percentage
    */
    displayPercentages: function(arr){

      //1. Get List of Expense items
      let expensesList = document.querySelectorAll(DOMStrings.item__percentage);

      //2. Loop through that list to change %percentage%
      expensesList.forEach( (item, idx) => {
        if(arr[idx] !== -1){
          item.textContent = arr[idx] + "%";
        }
        else{
          item.textContent = "---";
        }
      })


    },

    /*Function: Display Month
      Precondition: It is called when app is loading
      Postcondition: Update Current Month
    */
    displayMonth: function(){

      let now = new Date();
      let monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let month = now.getMonth();
      let year = now.getFullYear();

      document.querySelector(DOMStrings.budget__title__month).textContent =  monthArr[month] + " " + year;
    },

    /*Function: As Type (Income/Expense) Changes
      Precondition: It is called when change between Inc and Exp is made
      Postcondition: Update Styling
    */
    changeType: function () {
      let fields = document.querySelectorAll(DOMStrings.add__type
                                      +","+ DOMStrings.add__value,
                                      +","+ DOMStrings.add__btn);
      fields.forEach( item => item.classList.toggle("red-focus"));
      document.querySelector(DOMStrings.add__btn).classList.toggle("red");
    }
  }
})();

/*************APP Controller******************/
var APPController = (function(){

  /*Function: Calling UI Controller
    Precondition: It is called event is evoked
    Postcondition: It calls public function of UI Controllerto
                  to get input value
  */
  var ctrlAddItem = function () {
    // 1. Get input value
    var inputValueObj = UIController.getInput();

    // Check for valid input
    if(inputValueObj.description !== "" &&
        !isNaN(inputValueObj.value) &&
        inputValueObj.value > 0){
          // 2. Add new data to budge data Structure
          var id = budgetController.addItem(inputValueObj).id;

          // 3. Add new input value to HTML content flow
          UIController.addListItem(id, inputValueObj);

          // 4. Clear input fields
          UIController.clearFields();

          // 5. Update Budget
          updateBudget();

          //6. Update percentages
          updatePercentages();
    }

  }

  /*Function: Update Budget
    Precondition: It is called by ctrlAddItem()
    Postcondition: It calls public function of UI Controllerto
                  to get input value
  */
  var updateBudget = function () {

    //1. Calculate Budget with updated info
    budgetController.calculateBudget();

    //1. Update Budget UI
    UIController.displayBudget(budgetController.getBudget());

  }

  /*Function: Update Percentages
    Precondition: Individual Expense & total Expenses
    Postcondition: Calling calculatePercentage in budgetController
  */
  var updatePercentages =  function (){

    //1. Calculate percentages
    budgetController.calculatePercentages();

    //2. Update Percentage UI
    UIController.displayPercentages(budgetController.getPercentages());
  }

  /*Function: Set up event listener for the app
    Precondition: It is called when the app finishes loading
    Postcondition: Set up event listener for the app
  */
  var setupEventListener =  function (){
    var DOMStrings = UIController.getDOMStrings();

    document.querySelector(DOMStrings.add__btn).addEventListener("click", ctrlAddItem)

    document.addEventListener("keypress", function(e){
      if(e.keyCode === 13 || e.which === 13){
        ctrlAddItem();
      }
    })

    document.querySelector(DOMStrings.container).addEventListener("click", ctrlDeleteItem);
    document.querySelector(DOMStrings.add__type).addEventListener("change", UIController.changeType);
  };

  /*Function: Delete Income / Expense items
    Precondition: It is called as delete button is clicked
    Postcondition: Call deleteItem function in budgetController,
                  and deleteListItem in UIController
  */
  var ctrlDeleteItem = function(e){
    var idArr, id , type;

    //1. Get Item ID and Item Type
    idArr = e.target.parentNode.parentNode.parentNode.parentNode.id.split("-");
    id = parseInt(idArr[1]);
    (idArr[0] ==="income")? type= "inc" : type = "exp";

    //2. Delete Item in budget
    budgetController.deleteItem(type, id);

    //3. Update Budget
    updateBudget();

    //4. Update UI for Income/ Expense lists
    UIController.deleteListItem(idArr[0]+"-"+idArr[1]);

    //5. Update percentages
    updatePercentages();

  }

  return {
      init: function () {
        setupEventListener();
        UIController.displayBudget({
          totalIncome: 0,
          totalExpense: 0,
          budget: 0,
          percentage: "---"
        });
        UIController.displayMonth();
      }
  }
})();

APPController.init();
