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
let premiumStatus = null;
let listeners= [];

// get status of premium, used for conditional rendering of premium features
const getPremiumStatus = () => {
  return premiumStatus;
};

// set premium status, and notify listeners of the change
const setPremiumStatus = (value)=>{
  console.log("store value: " , value);
  premiumStatus = value;
  listeners.forEach(fn => fn(premiumStatus) );
};

// subscribe to changes in premium status. Returns an unsubscribe function to stop listening for changes
const subscribePremium = (fn) =>{
  listeners.push(fn);

  return ()=>{
    listeners = listeners.filter(listener => listener !== fn);
  };
};

module.exports = {
  handleError,
  sendPost,
  hideError,
  getPremiumStatus,
  setPremiumStatus,
  subscribePremium,

}