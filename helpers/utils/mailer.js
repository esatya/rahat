const config = require('config');
const fs = require('fs');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');

const host_url = config.get('app.frontEndUrl');
const {NOTIFICATION_TYPES} = require('../../constants');

const emailConfig = config.get('services.nodemailer.prefer');
// Defaults to AWS SES

let transporter = nodemailer.createTransport(
  ses({
    accessKeyId: config.get('services.nodemailer.aws.accessKeyId'),
    secretAccessKey: config.get('services.nodemailer.aws.secretAccessKey')
  })
);
if (emailConfig === 'gmail') {
  transporter = nodemailer.createTransport(config.get('services.nodemailer.gmail'));
}

handlebars.registerHelper('host_url', () => host_url);

const Templates = {
  [NOTIFICATION_TYPES.mobilizer_registered]: {
    subject: 'New Mobilizer Registered',
    html: `${__dirname}/../../assets/email_templates/new_mobilizer_registered.html`
  },
  [NOTIFICATION_TYPES.vendor_registered]: {
    subject: 'New Vendor Registered',
    html: `${__dirname}/../../assets/email_templates/new_vendor_registered.html`
  },
  [NOTIFICATION_TYPES.otp_by_mail]: {
    subject: 'Login OTP',
    html: `${__dirname}/../../assets/email_templates/otp.html`
  }
};

function TemplateMapper(from, name) {
  const template = Templates[name];
  template.from = from;
  return template;
}

class Messenger {
  getTemplate(from, name) {
    return TemplateMapper(from, name);
  }

  getHtmlBody(from, name, data) {
    const template = this.getTemplate(from, name);
    if (!template) return null;
    const text = fs.readFileSync(template.html, {encoding: 'utf-8'});
    const hTemplate = handlebars.compile(text);
    return hTemplate(data);
  }

  async send(payload) {
    const isEmailService = config.get('services.nodemailer.is_enabled');
    if (!isEmailService) return null;
    const me = this;
    const sender = config.get('services.otp.address');

    const template = this.getTemplate(sender, payload.template);
    if (!template) throw new Error('No template is defined');
    if (!payload.to) return null;

    if (payload.subject) {
      template.subject = payload.subject;
    }

    return transporter
      .sendMail({
        from: template.from,
        subject: template.subject,
        to: payload.to,
        html: me.getHtmlBody(template.from, payload.template, payload.data)
      })
      .then(() => transporter.close())
      .catch(err => console.log({err}));
  }

  checkNotifyMethod(data) {
    if (data.email) return 'email';
    return 'sms';
  }
}

module.exports = new Messenger();
