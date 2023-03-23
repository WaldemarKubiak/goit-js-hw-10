import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputSearchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

inputSearchBox.addEventListener(
  'input',
  debounce(eventHandler, DEBOUNCE_DELAY)
);

function eventHandler(e) {
  const countryName = e.target.value.trim();
  // console.log(countryName);
  if (countryName === '') {
    clearList();
    clearInfo();
    return;
  } else {
    fetchCountries(countryName)
      .then(countries => renderCountries(countries))
      .catch(error => backendErr(error));
    // => console.log('Backend err: ', error));
  }
}

function renderCountries(countries) {
  // console.log('How many countriest finded: ', countries.length);
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    clearList();
    clearInfo();
  } else if (countries.length >= 2 && countries.length <= 10) {
    renderCountryList(countries);
    // console.log('2 to 10 countries obj from API: ', countries);
  } else if (countries.length === 1) {
    renderCountryCard(countries);
    // console.log('ONE-1 country obj from API: ', countries);
  }
}

function renderCountryList(countries) {
  const markupList = countries
    .map(country => {
      return `<li class="country-list__item">
      <img class="country-list__flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="60" height="35"/>
      <span class="country-list__name">${country.name.official}</span>
      </li>`;
    })
    .join('');
  countryList.innerHTML = markupList;
  clearInfo();
}

function renderCountryCard(countries) {
  const markupCard = countries
    .map(country => {
      return `<div class="country-info__wrapper">
      <img class="country-info__flag" src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="70" height="40"/>
      <h1 class="country-info__name">${country.name.official}</h1>
    </div>
    <p class="country-info__description"><b>Capital: </b><span>${
      country.capital
    }</span></p>
    <p class="country-info__description"><b>Population: </b><span>${
      country.population
    }</span></p>
    <p class="country-info__description"><b>Languages: </b><span>${Object.values(
      country.languages
    ).join(', ')}</span></p>`;
    })
    .join('');
  clearList();
  countryInfo.innerHTML = markupCard;
  // console.log(markupCard);
}

function backendErr(error) {
  clearList();
  clearInfo();
  Notiflix.Notify.failure('Oops, there is no country with that name');
  // console.log('Backend 404 err: ', error);
}

function clearList() {
  countryList.innerHTML = '';
}

function clearInfo() {
  countryInfo.innerHTML = '';
}
