const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const newThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner,
    });

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
