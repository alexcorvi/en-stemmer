import * as regExps from "./regexp_rules";
import * as suffixList from "./suffix_list";

const stemmer = function (w:string):string {

	if(w.length < 3) return w;
	if(w.charAt(0) === "y") w = w.charAt(0).toUpperCase() + w.substr(1);

	// STEIP 1.a -----------------------------------------
	if (regExps.nonstd_S.test(w)) w = w.replace(regExps.nonstd_S,'$1$2');
	else if (regExps.std_S.test(w)) w = w.replace(regExps.std_S,'$1$2');

	// STEIP 1.b -----------------------------------------
	// When it ends with "eed" & the stem confirms with M_gr_0
	if (regExps.EED.test(w)) {
		let stem = (regExps.EED.exec(w) || [])[1];
		if (regExps.M_gr_0.test(w)) w = w.substr(0,w.length-1);
	}

	else if (regExps.ED_or_ING.test(w)) {
		let stem = (regExps.ED_or_ING.exec(w) || [])[1];
		if (regExps.v_in_stem.test(stem)) {
			w = stem;
			if (/(at|bl|iz)$/.test(w)) w = w + 'e';
			else if (new RegExp('([^aeiouylsz])\\1$').test(w)) w = w.substr(0,w.length-1);
			else if (new RegExp('^' + regExps.C + regExps.v + '[^aeiouwxy]$').test(w))w = w + 'e';
		}
	}

	// STEIP 1.c -----------------------------------------
	if (regExps.Y.test(w)) {
		let stem = (regExps.Y.exec(w) || [])[1];
		if (regExps.v_in_stem.test(stem)) w = stem + 'i';
	}

	// Step 2 -----------------------------------------
	if (regExps.nonstd_gp1.test(w)) {
		let result = regExps.nonstd_gp1.exec(w);
		let stem = result[1];
		let suffix = result[2];
		if (regExps.M_gr_0.test(stem)) w = stem + suffixList.suffixList.group1[suffix];
	}

	// Step 3 -----------------------------------------
	if (regExps.nonstd_gp2.test(w)) {
		let result = regExps.nonstd_gp2.exec(w);
		let stem = result[1];
		let suffix = result[2];
		if (regExps.M_gr_0.test(stem)) w = stem + suffixList.suffixList.group2[suffix];
	}

	// Step 4 -----------------------------------------
	if (regExps.nonstd_gp3.test(w)) {
		let result = regExps.nonstd_gp3.exec(w);
		let stem = result[1];
		if (regExps.M_gr_1.test(stem)) w = stem;
	}
	else if (regExps.S_or_T_with_ION.test(w)) {
		let result = regExps.S_or_T_with_ION.exec(w);
		let stem = result[1] + result[2];
		if (regExps.M_gr_1.test(stem)) w = stem;
	}

	// Step 5 -----------------------------------------
	if (regExps.E.test(w)) {
		let result = regExps.E.exec(w);
		let stem = result[1];
		if (regExps.M_gr_1.test(stem) || (regExps.M_eq_1.test(stem) && !(regExps.has_C_and_v_but_doesnt_end_with_AEIOUWXY.test(stem)))) w = stem;
	}

	if(regExps.LL.test(w) && regExps.M_gr_1.test(w)) w = w.substr(0,w.length-1);
	// and turn initial Y back to y
	if(w.charAt(0) === "Y") w = w.charAt(0).toLowerCase() + w.substr(1);

	return w;
};

export {stemmer};