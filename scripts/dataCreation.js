exports.execute = models => {
  models.user
    .create({
      firstName: 'test',
      lastName: 'wolox',
      password: '12345678',
      email: 'test@wolox.com.ar'
    })
    .then();
};
