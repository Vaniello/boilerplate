export default class Slider {
  constructor(props) {
    this.Slider = props.slider;
    this.currentSlideWrap = props.currentSlideWrap;
    this.prev = props.prev;
    this.next = props.next;
    this.items = props.images;
    this.pagination = props.pagination;
    this.paginationType = props.paginationType
    this.findPaginationItems = props.findPaginationItems;
    this.imagesWrapper = props.imagesWrapper;
    this.sliderAuthor = props.sliderAuthor || null;
    this.sliderDescr = props.sliderDescr || null;
    this.sliderTitle = props.sliderTitle || null;
    this.sliderLink = props.sliderLink || null;
    this.amount = this.items.length;
    
    this.counter = 0;

    this.next.addEventListener("click", () => this.navigate(1));
    this.prev.addEventListener("click", () => this.navigate(-1));

    this.prev.disabled = true;

    this.dots(this.amount, this.paginationType);
    this.activeSlide(this.counter);
    this.background(this.counter);
    this.info(this.counter);
    //this.startSlider(15000)
  }

  startSlider(interval) {
    let self = this
      return setInterval(function() {
        return self.navigate(1);
      }, interval);
  }
  navigate(direction) {
    this.counter = this.counter + direction;
    (this.counter >= this.amount) ? this.counter = 0 : null
    this.prev.disabled = this.counter === 0 && direction === -1 ? true : false;
    this.next.disabled =
      this.counter === this.amount - 1 && direction === 1 ? true : false;
    this.activeSlide(this.counter);
    this.background(this.counter);
    this.info(this.counter);
  }
  checkNum(num) {
    return num >= 0 && num < 10 ? `0${num + 1}` : num + 1;
  }
  background(counter) {
    this.imagesWrapper.dataset.progressive = this.items[counter].img;
    this.imagesWrapper.className = "progressive__img progressive--not-loaded";
    this.imagesWrapper.src = this.items[counter].imgLow;
    this.imagesWrapper.alt = this.items[counter].title;
    progressively.init({
      throttle: 500,
      delay: 50
    });
  }

  info(counter) {
    if (this.sliderAuthor) {
      this.sliderAuthor.style.animation = "none";
      this.sliderAuthor.offsetHeight;
      this.sliderAuthor.style.animation = "scale-animate 0.5s forwards";
      this.sliderAuthor.innerHTML = this.items[counter].author;
    }
   
    if (this.sliderDescr) {
      this.sliderDescr.style.animation = "none";
      this.sliderDescr.offsetHeight;
      this.sliderDescr.style.animation = "scale-animate 0.5s forwards";
      this.sliderDescr.innerHTML = this.items[counter].description;
    }
    if (this.sliderLink) {
      this.sliderLink.innerHTML = this.items[counter].linkName;
      this.sliderLink.href = this.items[counter].link;
    }

    this.sliderTitle.style.animation = "none";
    this.sliderTitle.offsetHeight;
    this.sliderTitle.style.animation = "scale-animate 0.5s forwards";
    this.sliderTitle.innerHTML = this.items[counter].title;
  }

  dots(numberOfSlides, paginationType) {
    if (paginationType === 'span') {
      for (let i = 0; i < numberOfSlides; i++) {
        this.pagination.innerHTML += `<li><span>${this.checkNum(i)}</span></li>`;
      }
    }
    if (paginationType === 'img') {
      for (let i = 0; i < numberOfSlides; i++) {
        this.pagination.innerHTML += `<li><img src="${this.items[i].imgLow}" alt="${this.items[i].title}" /></li>`;
      }
    }
  }

  activeSlide(counter) {
    const currentSlideWrap = this.currentSlideWrap;
    currentSlideWrap.innerHTML = this.checkNum(counter);

    const dots = document.querySelectorAll(this.findPaginationItems);
    for (let i = 0; i < dots.length; ++i) {
      dots[i].classList.remove("active");
    }

    dots[counter].classList.add("active");
  }
}

