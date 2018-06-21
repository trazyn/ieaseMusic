
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

/**
 * FROM NGA:
 * http://bbs.ngacn.cc/read.php?tid=7803294&forder_by=postdatedesc&_ff=7
 * */
const randomText = [
    '时间就是金钱我的朋友',
    '是办正事，还是找乐子？',
    '尘归尘，土归土。 ',
    '我还不能施放这个法术',
    '能量不足',
    '我需要更多的怒气值',
    '说得好！但这毫无意义。',
    '我很好奇，真的是正义驱使你们吗？',
    '狡诈的联盟狗 ',
    'lok tar! org! ',
    '自诩正义的圣光终于来了？我是不是该丢下霜之哀伤 恳求您的宽恕呢？',
    '你总是饿，所以我们才这么胖！',
    '下次我请',
    '皇帝之怒,响彻群山',
    '火墙火墙火墙火墙火墙火墙火墙火墙火墙',
    '换坦嘲讽',
    '炸弹快躲',
    '你的护甲毫无意义，你的信仰一文不值！',
    '这个按钮是干什么用的？',
    '你不能拿走我的蜡烛！',
    '复活吧，我的勇士！',
    '为你而战，我的女士！ ',
    'You will learn why im king and you were just little more than persons！',
    '快跑啊，小姑娘～快跑！',
    '赞吉尔没有朋友，赞吉尔自己造朋友……',
    '指挥官～～我全听你的，指挥官～～',
    'My son, no kind rules forever...... ',
    '蠢货！你别想控制我！',
    'V 站上都是基佬',
    'Life is short, use Python1',
];

class Loader extends Component {
    static propTypes = {
        show: PropTypes.bool,
        text: PropTypes.string,
    };

    static defaultProps = {
        show: false,
    };

    shouldComponentUpdate(nextProps) {
        if (nextProps.show === this.props.show) {
            return false;
        }

        return true;
    }

    render() {
        var classes = this.props.classes;
        var text = this.props.text || randomText[Math.floor(Math.random() * randomText.length)];

        return (
            <div
                className={clazz(classes.container, {
                    [classes.show]: this.props.show,
                })}>
                <span>{text}</span>
            </div>
        );
    }
}

export default injectSheet(classes)(Loader);
