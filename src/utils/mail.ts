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

export const referCandidateMail = async (email: string, name: string, jobId: string, title: string, location: string, companyName: string, description: string) => {
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
      "job_description": description,
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
      "role": jobTitle,
      "company": companyName,
    }
  })};

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
      // "get_started_link": "Test_Get_started_link",
      // "onboarding_video_link": "Test_Onboarding_video_link"
    }
  }
)};
