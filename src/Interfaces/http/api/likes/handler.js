const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    await addLikeUseCase.execute({ threadId, commentId, owner });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
