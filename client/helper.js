/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  const errMsg = document.getElementById('errorMessage')
  const alertMsg = document.getElementById('alertMessage')

  errMsg.textContent = message;
  alertMsg.classList.remove('hidden');

  //hide message after a delay of 20 seconds.
  setTimeout(() => {
    alertMsg.classList.add('hidden');
  }, 20000);

  document.querySelector('#closeAlert').onclick = () => {
    document.querySelector('#alertMessage').classList.add('hidden');
  };
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('alertMessage').classList.add('hidden');

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

/*
    Hides the error popup
*/
const hideError = () => {
  document.getElementById('alertMessage').classList.add('hidden');
};


// premium 
let premiumCache = null;
let premiumFetch = null;

const getPremiumCache = () =>{
  return premiumCache;
};

const setCachedPremiumStatus = (status) =>
{
  premiumCache = status;
}

const getPremiumStatus = async () => {
  if (premiumCache !== null) {
    return premiumCache;
  }

  // if request is already in flight, reuse it
  if (premiumFetch) {
    return premiumFetch
  }

  premiumFetch = fetch('/getUserStatus').then(res => res.json())
    .then(data => {
      premiumCache = data.premiumStatus;
      premiumFetch = null;
      return premiumCache;
    })
    .catch(err => {
      premiumFetch = null;
      throw err;
    });

  return premiumFetch;
};

module.exports = {
  handleError,
  sendPost,
  hideError,
  getPremiumStatus,
  getPremiumCache,
  setCachedPremiumStatus,
}