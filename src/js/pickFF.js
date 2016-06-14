// Choose a Founding Father

var ffChoices = [... document.querySelectorAll('.btn--ff-choice')];

ffChoices.forEach( function(elem, index) {
  elem.addEventListener('click', function(e) {
    console.log(this.innerHTML);

    document.querySelector('.final-composition').classList = `final-composition ${this.innerHTML.toLowerCase()}`;
    document.querySelector('img.fathers').src = `/img/founding-fathers--${this.innerHTML.toLowerCase()}.png`;
  });
});
