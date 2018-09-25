export default {
	// 该vuex使用全部使用大写，因为数据内容重要
	state: {
		connect: false,
		message: null,
		requestNewFriend: null
	},
	mutations: {
		// commit该函数，自动触发
		SOCKET_CONNECT: (state, status) => {
			state.connect = true;
		},
		// 添加好友重要性比较强，所以使用了message
		SOCKET_USER_MESSAGE: (state, user) => {
			console.log(user)
			if (user.headImg) {
				user.headImg = app.getResourceUrl(user.headImg)
			}
			state.requestNewFriend = user
		},
	},
	actions: {
		otherAction: (context, type) => {
			return true;
		},
		socket_userMessage: (context, message) => {
			context.dispatch('newMessage', message);
			context.commit('NEW_MESSAGE_RECEIVED', message);
			if (message.is_important) {
				context.dispatch('alertImportantMessage', message);
			}
		}
	}
};