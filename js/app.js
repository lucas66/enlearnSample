// init yahtzee as obj
var yahtzee = {};

//yahtzee game func
yahtzee.game = function(){
    this.diceArray = [];
    this.initialize();
}
//yahtzee game prototype - set all members
yahtzee.game.prototype = {
    roll: null,
    rollDisplay: null,
    btnRoll: null,
    diceArray: null,
    score: null,
    btnGo: null,
    categories: null,
    category: null,
    categoryLabels: null,
    suggestions: null,
    btnSuggestions: null,
    categorySuggestions: null,
    scoreHTML: null,

    ///initialize all members, funcs
    initialize: function(){
        self = this;
        this.rollDisplay = document.getElementById('roll');
        this.categories = document.getElementsByTagName('input');
        this.category = '';
        this.categoryLabels = document.getElementsByTagName('label');
        this.categoryLabel = '';
        this.categorySuggestions = document.getElementById('categorySuggestions');
        this.scoreHTML = document.getElementById('score');
        this.btnRoll = document.getElementById('btn-roll');

        //button roll click handler, reset DOM elements
        this.btnRoll.addEventListener('click', function(e){
            self.scoreHTML.innerHTML = '';
            self.categorySuggestions.className = '';
            self.categorySuggestions.innerHTML = '';
            self.roll();
            e.preventDefault();
        })
        
        this.btnGo = document.getElementById('go');
        //button go handler for scoring a specific section
        this.btnGo.addEventListener('click', function(e){
            //iterate through categories, find the selected cat and get value.  Get associated label as well
            for(var i = 0; i<self.categories.length; i++){
                if(self.categories[i].checked){
                    self.category = self.categories[i].value;
                    self.categoryLabel = self.categoryLabels[i];
                }
            }
            //add new DOM elements based on returned value
            self.scoreHTML.innerHTML = '<div>Category: <span class="highlight"> ' + self.categoryLabel.innerHTML + '</span> ' + 'Score: <span class="highlight"> ' + self.score(self.diceArray, self.category) + '</span></div>';
            //remove nasty hashtag in url
            e.preventDefault();
        })
        
        this.btnSuggestions = document.getElementById('suggestions');
        //button suggestions handler for getting suggested categories
        this.btnSuggestions.addEventListener('click', function(e){
            //Show UI
            self.categorySuggestions.className += 'show';
            //get 2d array back from suggestions func [score, category]
            var suggestedCategories = self.suggestions(self.diceArray);
            //for UI goodness, use the Label for the category returned in array
            var suggestedCategoryLabel = '';
            self.categorySuggestions.innerHTML = '<h3>Here are some categories that scored high</h3>';
            suggestedCategories.forEach(function(i){
                //iterate through returned array
                for (var v = 0; v < self.categoryLabels.length; v++){
                    //check label
                    if(self.categoryLabels[v].getAttribute('for') == i[1])
                        suggestedCategoryLabel = self.categoryLabels[v].innerHTML;
                }
                //add new DOM elements
                self.categorySuggestions.innerHTML += '<div>Category: <span class="highlight"> ' + suggestedCategoryLabel + '</span> Score <span class="highlight"> ' + i[0] + '</span></div><br />';
            })
            e.preventDefault();
        })
    },
    roll: function(){
        //reset display
        self.rollDisplay.innerHTML = '';
        //new dice array
        self.diceArray = [];
        //only 5 die, could be a constant
        for(var i = 0; i<5; i++){
            //get random number between 1 and 8, inclusive and push to array.
            var die = Math.floor(Math.random() * (8) + 1);
            self.diceArray.push(die);
            //create DOM elements for dice
            self.rollDisplay.innerHTML += '<div class="die">' + self.diceArray[i] + '</div>';
        }
    },
    score: function(dice, category){
        //switch based on category selected.  Possiblilty to optimize here, but I like separating out these functions
        //Lower Deck = Poker-type scores, Upper deck = simpler counting scores
        switch(category){
            case 'ones':
            return getUpperDeck(1);
            break;

            case 'twos':
            return getUpperDeck(2);
            break;

            case 'threes':
            return getUpperDeck(3);
            break;

            case 'fours':
            return getUpperDeck(4);
            break;

            case 'fives':
            return getUpperDeck(5);
            break;

            case 'sixes':
            return getUpperDeck(6);
            break;

            case 'sevens':
            return getUpperDeck(7);
            break;

            case 'eights':
            return getUpperDeck(8);
            break;

            case '3ofa':
            return getLowerDeck(category);
            break;

            case '4ofa':
            return getLowerDeck(category);
            break;

            case '5ofa':
            return getLowerDeck(category);
            break;

            case '0ofa':
            return getLowerDeck(category);
            break;

            
            case 'fullHouse':
            return getLowerDeck(category);
            break;

            case 'smstr':
            return getLowerDeck(category);
            break;
            
            case 'lgstr':
            return getLowerDeck(category);
            break;

            case 'chance':
            return getLowerDeck(category);
            break;

            default:
            alert('Select a Category!');
            break;
        }
        function getUpperDeck(num){
            //pass in number to check, return number * how many die w/number
           var count = 0;
            for(var i = 0; i<dice.length; i++){
                if(dice[i] == num)
                    count++;
            }
            return count * num;
             
        }
        function getLowerDeck(category){
            //for some of these funcs, we need a count of how many die have the same value
            var counts = {};
            var addEm = 0;
            dice.forEach(function(x) { 
                counts[x] = (counts[x] || 0)+1;
                addEm += x; 
            });
            //switch based on category, again may have room for optimization
            //return 0 if conditional not met for each category
            switch (category){
                case '3ofa':
                for(var n in counts){
                    if(counts[n] >= 3)
                        return addEm;
                }
                return 0;
                break;

                case '4ofa':
                for(var n in counts){
                    if(counts[n] >= 4)
                        return addEm;
                }
                return 0;
                break;

                case '5ofa':
                for(var n in counts){
                    if(counts[n] >= 5)
                        return 50;
                }
                return 0;
                break;
                
                case '0ofa':
                //if each value is unqiue, return 40
                var size = 0;
                for(var n in counts){
                    if(counts.hasOwnProperty(n))
                        size++;
                }
                if(size >= 5)
                    return 40;
                return 0;
                break;

                case 'fullHouse':
                //if there is a count of 3 and 2, return 25
                for(var n in counts){
                    if(counts[n] >= 3){
                       for(var i in counts){
                            if(counts[i] == 2)
                                return 25;
                            }
                        return 0;
                    }
                }
                break;

                case 'smstr':
                //for straights, need to alias and sort the dice array.
                var sortedDiceArray = dice;
                sortedDiceArray.sort();
                var sequence = 0;
                for(var i = 0; i<sortedDiceArray.length; i++)
                {
                    //if add one to array value at i, if equals array value at i + 1, sequence ++ 
                    if(parseInt(sortedDiceArray[i] + 1) == sortedDiceArray[i + 1])
                        sequence++;
                }
                if(sequence == 3)
                    return 40;
                return 0;
                break;

                case 'lgstr':
                var sortedDiceArray = dice;
                sortedDiceArray.sort();
                var sequence = 0;
                for(var i = 0; i<sortedDiceArray.length; i++)
                {
                    if(parseInt(sortedDiceArray[i] + 1) == sortedDiceArray[i + 1])
                        sequence++;
                }
                if(sequence == 4)
                    return 50;
                return 0;
                break;

                case 'chance':
                return addEm;
                break;
            }
        }
    },
    suggestions: function(dice){
        //init new array to return
        var suggestionsArray = [];
        //iterate through each category to get score based on roll
        for(var i = 0; i<self.categories.length; i++){
            var scoreForCategory = self.score(dice, self.categories[i].value);
            //if the category retuns more than 0, push score and category to array
            if(scoreForCategory > 0)
                suggestionsArray.push([scoreForCategory, self.categories[i].value]);
        }
        return suggestionsArray;
    }
}