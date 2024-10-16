import * as nodemailer from 'nodemailer';
import { MailtrapClient } from "mailtrap";

const ENDPOINT = "https://send.api.mailtrap.io/";
const TOKEN = "1e422935e908fc8f93bab3638f9bcac8";


interface MailtrapClientConfig {
  endpoint: string;
  token: string;
}

const clientConfig: MailtrapClientConfig = {
  endpoint: ENDPOINT,
  token: TOKEN
}

const client = new MailtrapClient(clientConfig);


const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: { 
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASS,
  },
});


export const sendVerificationToken = async (email: string, token: string, name: string) => {

const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "a7be1d59-1645-40d4-a6b5-6703014aa02f",
    template_variables: {
      "user_name": name,
      "user_otp": token,
    }
  })
}

export const referCandidateMail = async (email: string, name: string, jobId: string, title: string, location: string, companyName: string) => {
  const jobLink = `https://jobkonnecta.com/job/${jobId}`;

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

  const sender = {
    email: VERIFICATION_EMAIL,
    name: "Jobkonnecta",
  };
  const recipients = [
    {
      email,
    }
  ];

  client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "d2835849-1420-4754-93cd-634bd072f1ae",
    template_variables: {
      "user_name": name,
      "Job_Title": title,
      "company_name": companyName,
      "job_location": location,
      "next_step_link": jobLink,
    }
  })

};

export const resetPasswordToken = async (email: string, token: string, name: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

  client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "818a7355-96fe-49f3-ae81-7b80cb943b48",
    template_variables: {
      "user_name": name,
      "user_otp": token,
    }
  })
};

export const successfulPayment = async (email: string, productType: string, totalPrice: number, name: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "bb645bf8-f528-4a99-ad76-12a115b3bc7d",
    template_variables: {
      "user_name": name,
      "amount": totalPrice,
      "service": productType,
    }
  })
};

export const newOrder = async (email: string, productType: string, name: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "74fcd258-c11b-41db-a54b-257f17479c7e",
    template_variables: {
      "user_name": name,
      "service": productType,
    }
  })
};

export const hireApplicantMail = async (email: string, name: string, jobTitle: string, companyName: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "52a51785-9206-46e0-9508-35dc7e25c048",
    template_variables: {
      "name": name,
      "application": jobTitle,
      "company": companyName,
    }
  })
};


export const sendCvDetails = async (email: string, name: string, cv: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "c5b24b0d-9130-4507-ac3b-7d4d692361a0",
    template_variables: {
      "user_name": name,
      "next_step_link": cv,
    }
  }
)};

export const shortlistMail = async (email: string, name: string, jobTitle: string, companyName: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "8fea5ce2-dbea-4076-ac5f-df9cdf487811",
    template_variables: {
      "user_name": name,
      "application": jobTitle,
      "company": companyName,
    }
  });
};

export const rejectedMail = async (email: string, name: string, jobTitle: string, companyName: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "87994730-723a-47a7-8e36-a0deb1a10227",
    template_variables: {
      "user_name": name,
      "application": jobTitle,
      "company": companyName
    }
  })
};

export const contactUs = async (email: string, name: string, phone: string, message: string, senderMail: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "4427b8e7-bd27-4ab3-abd8-75f28e851951",
    template_variables: {
      "name": name,
      "email": senderMail,
      "phoneNumber": phone,
      "message": message,
      "user_name": "Test_User_name",
      "next_step_link": "Test_Next_step_link",
      "get_started_link": "Test_Get_started_link",
      "onboarding_video_link": "Test_Onboarding_video_link"
    }
  })

};

export const successfulResolution = async (email: string, name: string, message: string) => {

  const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL;

const sender = {
  email: VERIFICATION_EMAIL,
  name: "Jobkonnecta",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "8df75f2f-d5fc-4aaa-955f-bcd47a6568cc",
    template_variables: {
      "user_name": name,
      "message": message,
    }
  })
};
