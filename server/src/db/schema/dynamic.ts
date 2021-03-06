import mongoose = require('mongoose');
import { db } from '../connection';
import mongoosePaginate = require('mongoose-paginate'); // 翻页插件
import autoIncrement = require('mongoose-auto-increment-fix'); // id自增插件
import { IUser } from './user';
/**
 * 动态发布模型
 * @param {String} speech 言论
 * @param {Array<string>} album  相册
 * @param {Array<IDynamicComment>}  评论数组
 * @param {String} user  用户ID
 **/
/**
 * 实现业务：1。分享 2。点赞 3。足迹
 */
export declare interface IDynamic extends mongoose.Document {
    speech: string;
    album: string[];
    user: IUser; // 每一个用户对应多条动态
    phoneBy: string;
    create_at: Date;
    // 最后修改日期
    update_at: Date;
    // 其他元信息
    meta: IMeta;
    // 分享回来展示的动态
    forwardingDynamics: IforwardingDynamics;
    dynamicCommentList: IDynamicComment[];
}
export interface IMeta {
    totalPosts: number; // 帖子数
    totalCollection: number; // 收藏数
    totalShare: number; // 分享数
    totalDays: number; // 在线天数
    totalPraise: number; // 赞数
}
// 这个是分享
export interface IforwardingDynamics {
    title: string; // 分享的标题
    content: string; // 分享的内容
    album: string; // 分享的相册
}
export interface IDynamicComment {
    nickName: string;
    speech: string;
    createAt: Date;
}
// 自增ID初始化
autoIncrement.initialize(db.connection);
const dynamic_schema: mongoose.Schema = new mongoose.Schema({
    speech: {
        type: String,
        trim: true,
    },
    album: {
        type: Array,
        trim: true,
    },
    forwardingDynamics: {
        title: { type: String, trim: true },
        content: { type: String, trim: true },
        album: { type: Array, trim: true },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dynamicCommentList: {
        type: Array,
        trim: true,
    },
    phoneBy: {
        type: String,
        trim: true,
    },
    // 其他元信息
    meta: {
        totalPosts: { type: Number, default: 0 }, // 帖子数 ===> 不存于此处
        totalFootprint: { type: Number, default: 0 }, // 足迹
        totalShare: { type: Number, default: 0 }, // 分享数
        totalDays: { type: Number, default: 0 }, // 在线天数===》 后期替换
        totalPraise: { type: Number, default: 0 }, // 赞数
    },
},
{versionKey: false, timestamps: true}
);
// 转化成普通 JavaScript 对象
dynamic_schema.set('toObject', { getters: true });
// 翻页 + 自增ID插件配置
dynamic_schema.plugin(mongoosePaginate);
dynamic_schema.plugin(autoIncrement.plugin, {
    model: 'dynamic',
    field: 'id',
    startAt: 4,
    incrementBy: 1,
});
export default mongoose.model<IDynamic>('Dynamic', dynamic_schema);
