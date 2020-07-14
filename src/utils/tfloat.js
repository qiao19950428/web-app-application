// 计算精度
const EPSINON = 0.000001;
const TFloat = function (aFloat, isRealInt32) {
    this.inialValue = aFloat;
    if (isRealInt32) {
        this.iValue = aFloat;
        this.iUnits = 0;
        this.iDigit = 0;
    } else {
        this.iUnits = (aFloat & 0x00000003);
        this.iDigit = ((aFloat & 0x0000000C) >> 2);
        this.iValue = (aFloat >> 4);
    // int value = (iValue << 4);
    }
};

/**
* 设置TFloat基本值
* @param {[number]} aValue [值]
* @param {[number]} aDigit [小数点位数]
* @param {[number]} aUnits [单位]
*/
TFloat.prototype.set = function (aValue, aDigit, aUnits) {
    this.iValue = aValue;
    this.iDigit = aDigit;
    this.iUnits = aUnits;
};

/**
* 将TFloat数据转换为float数据
* @return {[float]} [转换结果]
*/
TFloat.prototype.toFloat = function () {
    return this.iValue * Math.pow(10, -this.iDigit + (this.iUnits << 2));
};

/**
* 将tfloat数值转换成TFloat对象，并最终转换成float值
* @param  {[number]} tfloat [TFLoat数值]
* @return {[float]}        [基本数值]
*/
TFloat.convert = function (tfloat) {
    const tresult = new TFloat(tfloat);

    return tresult.toFloat();
};

Number.prototype.convertTFloat = function () {
    const tresult = new TFloat(this);

    return tresult.toFloat();
};

/**
* 如果两个数的单位不一致，需要先把单位变成一致
*/
TFloat.prepare = function (val1, val2, enlarge) {
    while (val1.nDigit != val2.nDigit) {
        if (enlarge) {
            if (val1.nDigit < val2.nDigit) {
                val1.nValue *= 10;
                val1.nDigit++;
            } else if (val1.nDigit > val2.nDigit) {
                val2.nValue = val1.nValue * 10;
                val2.nDigit++;
            }
        } else if (val1.nDigit > val2.nDigit) {
            val1.nValue /= 10;
            val1.nDigit--;
        } else if (val1.nDigit < val2.nDigit) {
            val2.nValue /= 10;
            val2.nDigit--;
        }
    }
};


/**
* 加法
*/
TFloat.add = function (val1, val2) {
    TFloat.prepare(val1, val2, true);

    const f = new TFloat();

    f.iDigit = val1.iDigit;
    f.iUnit = Math.max(val1.iUnit, val2.iUnit);
    f.iValue = val1.iValue + val2.iValue;
    return f;
};

/**
* 减法
*/
TFloat.sub = function (val1, val2) {
    TFloat.prepare(val1, val2, true);

    const f = new TFloat();

    f.iDigit = val1.iDigit;
    f.iUnit = Math.max(val1.iUnit, val2.iUnit);
    f.iValue = val1.iValue - val2.iValue;
    return f;
};

/**
* 乘法
*/
TFloat.prototype.mul = function (val, val2) {
    TFloat.prepare(val1, val2, true);

    const f = new TFloat();

    f.iDigit = val1.iDigit;
    f.iUnit = Math.max(val1.iUnit, val2.iUnit);
    f.iValue = val1.iValue * val2.iValue;
    return f;
};

/**
* 乘法 整数
*/
TFloat.nmul = function (val, n) {
    const f = new TFloat();

    f.iDigit = val.iDigit;
    f.iUnit = val.iUnit;
    f.iValue = val.iValue * n;
    return f;
};

/**
* 除法
*/
TFloat.div = function (val1, val2) {
    TFloat.prepare(val1, val2, false);

    const f = new TFloat();
    if (val1 == null) {
        return f;
    }

    if (val2 == null) {
        return f;
    }

    if (val1.fValue >= -EPSINON && val1.fValue <= EPSINON) {
        return f;
    }

    if (val2.fValue >= -EPSINON && val2.fValue <= EPSINON) {
        return f;
    }
    f.iDigit = val1.iDigit;
    f.iUnit = Math.max(val1.iUnit, val2.iUnit);
    f.iValue = val1.iValue / val2.iValue;
    return f;
};

/**
* 除法 整数
*/
TFloat.ndiv = function (val1, n) {
    const f = new TFloat();
    if (val1 == null) {
        return f;
    }

    if (n == 0) {
        return f;
    }

    if (val1.fValue >= -EPSINON && val1.fValue <= EPSINON) {
        return f;
    }

    f.iDigit = val1.iDigit;
    f.iUnit = val1.iUnit;
    f.iValue = val1.iValue / n;
    return f;
};

/**
* 最大值
*/
TFloat.max = function (val1, val2) {
    TFloat.prepare(val1, val2, true);

    const f = new TFloat();

    f.iDigit = val1.iDigit;
    f.iUnit = Math.max(val1.iUnit, val2.iUnit);
    f.iValue = Math.max(val1.iValue, val2.iValue);
    return f;
};

/**
* 绝对值
*/
TFloat.abs = function (val) {
    const f = new TFloat();

    f.iDigit = val.iDigit;
    f.iUnit = val.iUnit;
    f.iValue = Math.abs(val.iValue);
    return f;
};

export default TFloat;
