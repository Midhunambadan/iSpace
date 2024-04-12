

const sendVerifyMail = async (req,res) => {
  try {
     
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
          // If the email already exists, render an error message
          console.log("Email found")
         return res.status(500).json({success:false,
              warningMessage: "Email already exists. Choose a different email."
          });
          
      }

      req.session.name = req.body.name;
      req.session.email = req.body.email;
      req.session.mobile = req.body.mobile;
      req.session.password= req.body.password;
      req.session.referral= req.body.referral;
     
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL,
              // pass: 'nfjy xgfz fyxo rimf',
              pass:process.env.EMAIL_PASSWORD,

          },
      });

      const otp = OTP.generateOTP();
      req.session.otp = otp
      clearRegistrationOtp(req)
      console.log("sendmail - generatd-otp:",otp)
      const mailOptions = {
          from: 'abhilash.brototype@gmail.com',
          to: req.body.email,
          subject: 'Verification Mail',
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #007bff;">Verification Code</h2>
                  <p>Dear User,</p>
                  <p>Your verification code is: <strong style="font-size: 1.2em; color: #28a745;">${otp}</strong></p>
                  <p>Please use this code to complete the verification process.</p>
                  <p>If you did not request this code, please ignore this email.</p>
                  <p>Best regards,<br> Mong Fashion's Team</p>
              </div>
          `,
      };

      // Use Promise style for sending mail
      const info = await transporter.sendMail(mailOptions);
      // res.redirect('/verifyotp')
      res.status(200).json({success:true,redirect:'/verifyotp'})

  } catch (error) {
      res.render('../pages/error',{error:error.message})
      console.error('Error sending email:', error.message);
      
  }

};




// <script>
       
//        function togglePasswordVisibility() {
//            const passwordInput = document.getElementById('password');
//            const cpasswordInput = document.getElementById('confirmPassword');
       
//            passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
//            cpasswordInput.type = (cpasswordInput.type === 'password') ? 'text' : 'password';
//        }
       
//              function validateForm() {
//                  var name = document.getElementById('name').value;
//                  var email = document.getElementById('email').value;
//                  var mobileNumber = document.getElementById('mobileNumber').value;
//                  var referralId = document.getElementById('referralId').value;
//                  var password = document.getElementById('password').value;
//                  var confirmPassword = document.getElementById('confirmPassword').value;
         
//                  // Reset error messages
//                  resetErrorMessages();
         
//                  // Check for empty fields
//                  if (!name || !email || !mobileNumber || !password || !confirmPassword) {
//                    //  preventDefault();
//                      displayErrorMessage('Please fill in all required fields.', 'error-message-general');
//                      return;
//                  }
         
//                  // Check for spaces in any field
//                  if (containsSpace(name)) {
//                      // preventDefault();
//                      displayErrorMessage('Name cannot contain spaces.', 'error-message-name');
//                      return;
//                  }
         
//                  if (containsSpace(email)) {
//                      // preventDefault();
//                      displayErrorMessage('Email cannot contain spaces.', 'error-message-email');
//                      return;
//                  }
         
//                  if (containsSpace(mobileNumber)) {
//                      // preventDefault();
//                      displayErrorMessage('Mobile Number cannot contain spaces.', 'error-message-mobile');
//                      return;
//                  }
         
//                  if (containsSpace(referralId)) {
//                      // preventDefault();
//                      displayErrorMessage('Referral ID cannot contain spaces.', 'error-message-referral');
//                      return;
//                  }
         
//                  if (containsSpace(password)) {
//                      // preventDefault();
//                      displayErrorMessage('Password cannot contain spaces.', 'error-message-password');
//                      return;
//                  }
//                  if (password.length < 8) {
//                      // preventDefault();
//                      displayErrorMessage('Password Must 8 digit', 'error-message-password');
//                      return;
//                  }
                
                
         
//                  if (containsSpace(confirmPassword)) {
//                      // preventDefault();
//                      displayErrorMessage('Confirm Password cannot contain spaces.', 'error-message-confirm-password');
//                      return;
//                  }
         
//                  // Check email format
//                  if (!isValidEmail(email)) {
//                      // preventDefault();
//                      displayErrorMessage('Please enter a valid email address.', 'error-message-email');
//                      return;
//                  }
         
//                  // Check password match
//                  if (password !== confirmPassword) {
//                      // preventDefault();
//                      displayErrorMessage('Passwords do not match', 'error-message-confirm-password');
//                    return false;
       
//                  }
//                  submitForm()
       
//              }
       
//               // Function to submit the form
//               function submitForm(){
//                  console.log("Submit form worked")
//                    const name = document.getElementById('name').value;
//                    console.log(name)
//                    const email = document.getElementById('email').value
//                    const password = document.getElementById('password').value;
//                    const referral = document.getElementById('referralId').value;
//                    const mobile = document.getElementById('mobileNumber').value;
                 
//                    console.log(name,email,password,mobile,referral)
       
//                    fetch('/register', {
//                        method: 'post',
//                        headers: {
//                            'Content-Type': 'application/json',
//                        },
//                        body: JSON.stringify({
//                            email: email,
//                            password: password,
//                            mobile: mobile,
//                            name: name,
//                            referral: referral,
//                        }),
//                    })
//                    .then(res => res.json())
//                    .then(data => {
//                        // Handle data here
//                      console.log("Worked 2")
//                      if(data.warningMessage){
//                          toastr.warning(data.warningMessage)
//                        }
//                        if(data.success){
//                          window.location.href = "/verifyotp"
//                        }
//                    })
//                    .catch(error => {
//                        console.error('Fetch error:', error);
//                    });
//                }
         
//              function displayErrorMessage(message, errorMessageId) {
//                  var errorMessageElement = document.getElementById(errorMessageId);
//                  errorMessageElement.innerHTML = message;
//                  errorMessageElement.style.color = 'red';
//                  errorMessageElement.style.display = 'block';
         
//                  // Automatically hide the error message after 4 seconds
//                  setTimeout(function () {
//                      errorMessageElement.style.display = 'none';
//                  }, 4000);
//              }
         
//              function containsSpace(value) {
//                  return /\s/.test(value);
//              }
         
//              function isValidEmail(email) {
//                  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                  return emailRegex.test(email);
//              }
         
//              function resetErrorMessages() {
//                  // Reset error messages to hide them initially
//                  var errorMessages = document.querySelectorAll('[id^="error-message-"]');
//                  errorMessages.forEach(function (errorMessage) {
//                      errorMessage.innerHTML = '';
//                      errorMessage.style.display = 'none';
//                  });
//              }
//          </script>