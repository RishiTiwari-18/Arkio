import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User is required'],
			index: true,
		},
		title: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

chatSchema.index({ user: 1, updatedAt: -1 });

const chatModel = mongoose.model('Chat', chatSchema);

export default chatModel;
