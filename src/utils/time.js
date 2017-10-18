
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export default {

    /**
     * 获取多少天前的日期
     * getDateOfDays(7) 表示7天前的日期
     */
    getDateOfDays: (days) => {
        const date = moment(new Date()).subtract(days,"days").format(DATE_FORMAT);
        return date;
    },

    /**
     * 获取当月的起始或结束日期
     * param: start/end
     */
    getDataOfMonth: (startOrEnd) => {

        if(startOrEnd == "start"){
            // 月初
            return moment().startOf('month').format(DATE_FORMAT);
        }else if(startOrEnd == "end"){
            // 月底
            return moment().endOf('month').format(DATE_FORMAT);
        }
        
    }

}