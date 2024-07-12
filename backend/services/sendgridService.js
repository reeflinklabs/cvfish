import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendCVEmail = async (cvData, userEmail) => {
  const {
    userId,
    country,
    city,
    phoneNumber,
    linkedIn,
    education,
    work,
    extracurriculars,
    other,
  } = cvData;

  const msg = {
    to: 'marc@reeflinklabs.com', // recipient
    from: userEmail, // sender's email
    subject: 'New CV Submission',
    text: `
      A new CV has been submitted by user ID: ${userId}.
      
      Country: ${country}
      City: ${city}
      Phone Number: ${phoneNumber}
      LinkedIn: ${linkedIn}
      Education: ${education}
      Work: ${work}
      Extracurriculars: ${extracurriculars}
      Other: ${other}
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('CV email sent successfully');
  } catch (error) {
    console.error('Error sending CV email:', error);
  }
};

export default sendCVEmail;
