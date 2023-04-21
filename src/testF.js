import b from './testB';
import c from './testC';
import { isEmpty } from 'lodash';
if(isEmpty("")) {
    console.log('iftestF', b, c);
}else{
    console.log('elsetestF', b, c);
}
// console.log('testF', b, c);
export default 'testF';
