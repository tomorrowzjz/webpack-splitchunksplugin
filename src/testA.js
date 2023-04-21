import b from './testB';
import c from './testC';
import { isEmpty } from 'lodash';
if(isEmpty(b)) {
    console.log('testA', b, c);
}else{
    console.log('testA', b, c);
}
export default 'testA';
