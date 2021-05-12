const search = document.getElementById('search'),
    submit =document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    singlMealEl = document.getElementById('single-meal');


//search for meal and fetch from API
function searchMeal(event){
    event.preventDefault();
    //clear the pae
    singlMealEl.innerText = ''
    const term = search.value;
   
    //check if empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            resultHeading.innerHTML = `<h2>Search results for '${term}' :</h2>`;

            if(data.meals  === null){
                resultHeading.innerHTML = `<h3>There are no results for '${term}', Try again</h3>`;
            }else{
                mealsEl.innerHTML = data.meals
                .map(
                    meal => `
                <div class="meal">
                     <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                     <div class= "meal-info"  data-MealId = '${meal.idMeal}'>
                         <h3>${meal.strMeal}</h3>
                    </div>
                 </div>
                 `
                 ).join('');
            }
        });
        //clear search value 
        search.value = '';
    }else{
        alert('Please Enter Term Value');
    }

}
//fetch meal info
function getMealInfoById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then( data => {
       const meal = data.meals[0];
       addMealToDom(meal);
    })
}

function addMealToDom(meal){
    const ingredients = [];
    for(let i =1; i<=20; i++ ){
        if(meal[`strIngredient${i}`]){
            ingredients.push(` ${meal[`strIngredient${i}`]}   ${meal[`strMeasure${i}`]}`);
        }else{
            break;
        }
    }
    singlMealEl.innerHTML = `
    <div class='single-meal'>
    <h1>${meal.strMeal}</h1>
    <img  src='${meal.strMealThumb}' alt = '${meal.strMeal}'/>
    <div class= 'single-meal-info'>
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class='main'>
    <p>${meal.strInstructions}</p>
    <h1>Ingredients</h1>
    <ul>
    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
    </div>
    </div>`
}
//function get random meal API
function getRandomMeal(){
    mealsEl.innerHTML='';
    resultHeading.innerHTML='';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res =>res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDom(meal);
    });
}



//event listeners
submit.addEventListener('submit',searchMeal);    
random.addEventListener('click',getRandomMeal);    
mealsEl.addEventListener('click', event =>{
   const mealInfo = event.path.find( item => {
       if(item.classList){
           return item.classList.contains('meal-info');
       }else{
           return false;
       }
   });
    if(mealInfo){
        const mealId = mealInfo.getAttribute('data-MealId');
        getMealInfoById(mealId);
    }
});