/**
 * Refusing to seal user requests
 */
module.exports =  () => {
  return async (ctx: any, next: any) => {
      const sealList = global.mdb.get('sealList');
      if (ctx.socket.user && sealList.has(ctx.socket.user.toString())) {
          return ctx.res = '你已经被关进小黑屋中, 请反思后再试';
      }

      await next();
  };
};
