import { boot } from "quasar/wrappers";
import _ from "lodash";

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$_

  app.config.globalProperties.$_ = _;
  // ^ ^ ^ this will allow you to use this.$_ (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
});
