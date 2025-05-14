import back from "./back.vue";
import del from "./del.vue";
import edit from "./edit.vue";
import end from "./end.vue";
import pass from "./pass.vue";
import submit from "./submit.vue";
import ts from "./ts.vue";
import cancel from "./cancel.vue";
import { Vue } from "vue-property-decorator";
const components = [back, del, edit, end, pass, submit, ts, cancel];

components.forEach((comp: any) => {
	Vue.component(comp.compName, comp);
});
