// Used for experience bar and level displays
const calcEXP = (exp: number) => {
  /****************************************************
   * for now to go from lvl 0 to lvl 1 will be 1000exp
   * each lvl after will be 10% more than the lvl before
   * To reach...
   * lvl 1 = 1000exp, lvl 2 = 1100exp, lvl 3 = 1210exp, lvl 4 = 1331exp, ...
   * total:  1000             2100             3310exp
   * to determine experience needed take exp from user data and calculate lvl
   *****************************************************/
  let tempNeededEXP = 1000;
  let tempProgressEXP = exp;
  let tempLevel = 0;

  while (tempProgressEXP >= tempNeededEXP) {
    tempProgressEXP -= tempNeededEXP;
    tempLevel++;
    tempNeededEXP = Math.floor(tempNeededEXP + tempNeededEXP * 0.1);
  }
  return {
    level: tempLevel,
    neededEXP: tempNeededEXP,
    progressEXP: tempProgressEXP,
  };
};
export default calcEXP;
