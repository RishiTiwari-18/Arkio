import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
	{
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Chat',
			required: [true, 'Chat is required'],
			index: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		role: {
			type: String,
			enum: ['user', 'ai'],
			required: [true, 'Role is required'],
			index: true,
		},
		content: {
			type: String,
			required: [true, 'Content is required'],
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

messageSchema.index({ chat: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
