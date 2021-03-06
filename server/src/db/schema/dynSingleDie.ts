import mongoose = require('mongoose');
import { IUser } from './user';
import { IDynamic } from './dynamic'
import { IActivity } from './activity'
/**
 * // 操作表，操作该数据类型是否能进行操作 =====>判断是否已经被操作过，没有就可以进行操作
 * 1.0 用户模型 ===》 动态----> 点赞之后的逻辑判断处理
 * 2.0 增加活动点赞和分享到足迹业务
 * @param {String} dynamic // 被处理过的动态Id
 * @param {number} type 0 已经被赞过了  1 已经被发送到足迹  2已经被关注了
 * @param {String} acceptUserId 处理人 ===》 是谁实施了这篇文章的操作
 * @param {Time} 时间
 **/
export interface IDynSingleDie extends mongoose.Document {
    dynamic: IDynamic;
    activity: IActivity;
    user: IUser;
    acceptUser: IUser;
    type: number;
}
const dynSingleDie_schema: mongoose.Schema = new mongoose.Schema({
    dynamic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dynamic'
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    },
    type: {
        type: Number,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    acceptUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},
{versionKey: false, timestamps: true}
);
// 转化成普通 JavaScript 对象
dynSingleDie_schema.set('toObject', { getters: true });
export default mongoose.model<IDynSingleDie>('DynSingleDie', dynSingleDie_schema);
