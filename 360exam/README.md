## 手势密码思路：
1. 用canvas画出基本图样模板(9个密码圈)
2. 监听touchmove，判断pageX和pageY是否经过密码圈，添加并画出经过的点和线
3. 监听mouseup，判断密码长度是否大于5，是则触发hasPasswd事件。
4. 添加passwdRight，passwdWrong等事件用于用户使用。
5. 将以上4步封装成插件，设置默认值。
6. 调用插件，通过监听radio选择并选择监听的hasPasswd事件调用。