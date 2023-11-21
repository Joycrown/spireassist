// require('dotenv').config();
const publishable_key = "pk_test_51O9nO6DzfAzbhczjHpTJYXv4dW8HOYraRfQurXBjVDAOGmNCDIPFC3zFezIrvpIarW5yAAnP41Xw41AV5FsozZV200FaQr3X3C"
$(document).ready(function () {
  var stripe = Stripe(publishable_key);

  $('input[type="radio"]').change(function () {
    if ($(this).is(":checked")) {
      var selectedAmount = $(this).val();
      $('#custom').val(''); // Clear custom input when a radio button is selected
      console.log("Selected amount: $" + selectedAmount);
      // You can use 'selectedAmount' for further processing or set it as a global variable
    }
  });

  $('#custom').on('input', function () {
    $('input[type="radio"]').prop('checked', false); // Uncheck radio buttons when custom input changes
    // You can use 'customAmount' for further processing or set it as a global variable
  });

  $('#checkout-button').on('click', function () {
    var selectedAmount = $('input[name="Amount"]:checked').val() || $('#custom').val();
    if (!selectedAmount) {
      alert('Please select an amount');
      return;
    }
   const url = "https://spireassist.vercel.app/api/create-checkout-session"
    // Create a Checkout Session
    fetch('https://spireassist.vercel.app/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: selectedAmount * 100, // Stripe requires the amount in cents
      }),
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error('Error:', error);
    
      // Check if the error is a JSON parsing error
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        alert('Error: Unexpected response from the server');
      } else {
        alert('An error occurred. Please try again later.');
      }
    });
  });
});