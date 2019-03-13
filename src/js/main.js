import HandleForm from './_form.js'
import Slider from './_slider.js'


document.addEventListener("DOMContentLoaded", () => [...document.querySelectorAll('form')].forEach(form => new HandleForm(form)))
