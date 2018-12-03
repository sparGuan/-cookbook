import moment = require('moment');
import mongoose = require('mongoose');
// 公共服务层
export default class Service<T> {
  private Mirror: any; // 需要执行业务时使用的属性
  private MirrorList: any []; // 需要执行业务时使用的属性
  // public genericSingleDieService: (identity: T, d: any) => T;
  // 生成全局的点赞业务处理
  // 生成一个全局的装饰器 》》》》后面再去封装
  /**
   * @param {object} class 操作点赞，足迹等业务的执行操作的类
   * @param {object} data 操作点赞，足迹等业务的数据
   */
  public async genericSingleDieService (Identity: any, Child: any , data: any) {
    const today: string = moment().format('L') as string;
    const acceptUser = data.acceptUser = mongoose.Types.ObjectId(data.acceptUserId)
    const user = data.user = mongoose.Types.ObjectId(data.userId)
    this.MirrorList = (await Child.find({
      acceptUser,
      user,
      create_at: { $gte: today },
      type: Number(data.type)
    })) as any [];
    try {
        if (this.MirrorList.length === 0) {
          // 插入数据
          data.dynamic = mongoose.Types.ObjectId(data.dynamicId)
          this.Mirror = new Child(data);
          await this.Mirror.save();
          const _id = data.dynamicId;
          // 给被看动态的用户点赞 +1
          const rootTable = (await Identity.findById(_id) as any );
          await rootTable.update(
            { $inc: {
              'meta.totalPraise': 1
            } },
            { new: true });
            return Promise.resolve(true)
        } else {
          return Promise.resolve(false)
        }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}