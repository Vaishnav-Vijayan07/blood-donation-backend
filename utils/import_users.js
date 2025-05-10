const sequelize = require("../config/database");
const { Op } = require("sequelize");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { UniqueConstraintError } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

async function getNextLoginId() {
  const prefix = "KSESA";
  try {
    // Find the highest existing KSESAXXX login_id
    const lastUser = await User.findOne({
      where: { login_id: { [Op.like]: `${prefix}%` } },
      order: [["login_id", "DESC"]],
    });

    let counter = 1;
    if (lastUser && lastUser.login_id) {
      const lastNumber = parseInt(lastUser.login_id.replace(prefix, ""), 10);
      if (!isNaN(lastNumber)) {
        counter = lastNumber + 1;
      }
    }

    // Generate login_id with leading zeros
    const loginId = `${prefix}${counter.toString().padStart(3, "0")}`;
    return loginId;
  } catch (error) {
    throw new Error(`Failed to generate login_id: ${error.message}`);
  }
}

const userData = [
  { full_name: "Ajaykumar C", blood_group: "O-", mobile_number: "9048255012" },
  { full_name: "Ananthan K. C", blood_group: "O+", mobile_number: "9446079547" },
  { full_name: "Aneeshkumar T. V", blood_group: "A+", mobile_number: "9497802795" },
  { full_name: "Antony Roy C. A", blood_group: "O+", mobile_number: "7907184139" },
  { full_name: "Babu P.M", blood_group: "O+", mobile_number: "9447994053" },
  { full_name: "Bashpajan C. K", blood_group: "A+", mobile_number: "9446315991" },
  { full_name: "Benny P. V", blood_group: "B+", mobile_number: "9496240467" },
  { full_name: "Binoy M. V", blood_group: "B+", mobile_number: "9400250976" },
  { full_name: "Binoy P. B", blood_group: "A+", mobile_number: "9496348723" },
  { full_name: "Binu M.K", blood_group: "O+", mobile_number: "9496167090" },
  { full_name: "Dhakshinamoorthi P. B", blood_group: "A+", mobile_number: "9446053627" },
  { full_name: "Dhibose E. P", blood_group: "B-", mobile_number: "9495040820" },
  { full_name: "Dileep S.A", blood_group: "B+", mobile_number: "8907570175" },
  { full_name: "Dixon V. Davis", blood_group: "O+", mobile_number: "9744918003" },
  { full_name: "George V. R", blood_group: "B+", mobile_number: "9744669797" },
  { full_name: "Gireesh K. S", blood_group: "O+", mobile_number: "9809965715" },
  { full_name: "Haridas P. A", blood_group: "O+", mobile_number: "9747865625" },
  { full_name: "Haridas K. R", blood_group: "A-", mobile_number: "9496419354" },
  { full_name: "Haroon Rasheed M. A", blood_group: "B+", mobile_number: "9895819963" },
  { full_name: "Jabbar V. M", blood_group: "O+", mobile_number: "9744207844" },
  { full_name: "Jeesmon K. V", blood_group: "A+", mobile_number: "9744770603" },
  { full_name: "Joseph P. L", blood_group: "O+", mobile_number: "9846741016" },
  { full_name: "Joseph A. C", blood_group: "O+", mobile_number: "9446064931" },
  { full_name: "Joshy C. B", blood_group: "A+", mobile_number: "9446366480" },
  { full_name: "Kannan T. K", blood_group: "B+", mobile_number: "8921210838" },
  { full_name: "Krishnakumar P. P", blood_group: "AB+", mobile_number: "9946239958" },
  { full_name: "Lonappan K. J", blood_group: "O+", mobile_number: "9946554705" },
  { full_name: "Manmathan K. S", blood_group: "B+", mobile_number: "9495132418" },
  { full_name: "Manoj K. S", blood_group: "A+", mobile_number: "9446089575" },
  { full_name: "Manojkumar M. M", blood_group: "O+", mobile_number: "9744851010" },
  { full_name: "Meera Sahib", blood_group: "B+", mobile_number: "9539692722" },
  { full_name: "Mohanan T. G", blood_group: "A+", mobile_number: "9495057955" },
  { full_name: "Mohandas K. N", blood_group: "B+", mobile_number: "6282940629" },
  { full_name: "Moyish A. V", blood_group: "O+", mobile_number: "9446760688" },
  { full_name: "Nelson M. R", blood_group: "O+", mobile_number: "9447049317" },
  { full_name: "Padmarajan M. S", blood_group: "O+", mobile_number: "9497179103" },
  { full_name: "Poly K. T", blood_group: "O+", mobile_number: "9747010999" },
  { full_name: "Prasanth V.", blood_group: "A+", mobile_number: "9497180760" },
  { full_name: "Prince K. M", blood_group: "A+", mobile_number: "9446021310" },
  { full_name: "Radhakrishnan M. R", blood_group: "B+", mobile_number: "9495881388" },
  { full_name: "Rajesh K. V. (Sr)", blood_group: "B+", mobile_number: "9847863141" },
  { full_name: "Raju K.K", blood_group: "A+", mobile_number: "9446025417" },
  { full_name: "Ramachandran P", blood_group: "O+", mobile_number: "6282809077" },
  { full_name: "Ramakrishnan K. R", blood_group: "B+", mobile_number: "9446311971" },
  { full_name: "Ratheesh V", blood_group: "B+", mobile_number: "8547579124" },
  { full_name: "Sajeev K. M", blood_group: "AB+", mobile_number: "9544012091" },
  { full_name: "Saji M. S", blood_group: "O+", mobile_number: "8086887946" },
  { full_name: "Saji T. S", blood_group: "A+", mobile_number: "9747074977" },
  { full_name: "Santhosh A", blood_group: "O+", mobile_number: "9495276430" },
  { full_name: "Santhosh E. C", blood_group: "O+", mobile_number: "9656019504" },
  { full_name: "Satheesh O. S", blood_group: "B+", mobile_number: "9495355434" },
  { full_name: "Satheeshkumar K. S", blood_group: "B+", mobile_number: "9446067110" },
  { full_name: "Shafeek T. A", blood_group: "A+", mobile_number: "7012456625" },
  { full_name: "Shaji P. P", blood_group: "B+", mobile_number: "9446351544" },
  { full_name: "Shaju P. P", blood_group: "O+", mobile_number: "7034162126" },
  { full_name: "Shibu K. S", blood_group: "B+", mobile_number: "9605069484" },
  { full_name: "Shiju M. D.", blood_group: "O+", mobile_number: "9495132438" },
  { full_name: "Sivasankaran P. G", blood_group: "A+", mobile_number: "9895112708" },
  { full_name: "Sony K. Devassy", blood_group: "A+", mobile_number: "9446362002" },
  { full_name: "Sudheeran P. K", blood_group: "O+", mobile_number: "9497179320" },
  { full_name: "Sunilkumar T. R", blood_group: "AB+", mobile_number: "9446619805" },
  { full_name: "Sunilkumar K", blood_group: "B+", mobile_number: "9447268904" },
  { full_name: "Sunilkumar K. P", blood_group: "O+", mobile_number: "9947975383" },
  { full_name: "Sunilkumar N. G", blood_group: "B+", mobile_number: "9497180801" },
  { full_name: "Sunilkumar P. R", blood_group: "O+", mobile_number: "9446143372" },
  { full_name: "Suresh C.A", blood_group: "O+", mobile_number: "9947732318" },
  { full_name: "Suresh K. N", blood_group: "O+", mobile_number: "9495194415" },
  { full_name: "Sureshkumar T. S", blood_group: "B+", mobile_number: "9495752020" },
  { full_name: "Tony Vargheese", blood_group: "O+", mobile_number: "9497250576" },
  { full_name: "Ummer V.A", blood_group: "O+", mobile_number: "8547563193" },
  { full_name: "Valsan K. K", blood_group: "B+", mobile_number: "9747001212" },
  { full_name: "Abdul Jabbar V. B", blood_group: "B+", mobile_number: "9961487511" },
  { full_name: "Arunkumar P. B", blood_group: "O-", mobile_number: "9446371151" },
  { full_name: "Fabin Paulose", blood_group: "O+", mobile_number: "9495667653" },
  { full_name: "Habeeb K", blood_group: "O+", mobile_number: "9446062928" },
  { full_name: "Jayadevan K. A", blood_group: "O+", mobile_number: "9446062573" },
  { full_name: "Pramod A. S", blood_group: "B+", mobile_number: "9446619726" },
  { full_name: "Renjith T. J", blood_group: "A+", mobile_number: "9496501759" },
  { full_name: "Sunil P. K", blood_group: "O+", mobile_number: "8921627694" },
  { full_name: "Sunilkumar A. B", blood_group: "A+", mobile_number: "9539029244" },
  { full_name: "Unnikrishnan K. K", blood_group: "A+", mobile_number: "9497070293" },
  { full_name: "Anilkumar K. M", blood_group: "A+", mobile_number: "9946858315" },
  { full_name: "Devadas C. K", blood_group: "O+", mobile_number: "9188477747" },
  { full_name: "Eldo K. V", blood_group: "B+", mobile_number: "9495157339" },
  { full_name: "Falgunan D", blood_group: "B+", mobile_number: "9846128853" },
  { full_name: "Gopakumar K. S", blood_group: "O+", mobile_number: "9446088425" },
  { full_name: "Jaison Jose V", blood_group: "B+", mobile_number: "9846713405" },
  { full_name: "Jaison P.A", blood_group: "O+", mobile_number: "9562088744" },
  { full_name: "Joshy C.A", blood_group: "O+", mobile_number: "9961606048" },
  { full_name: "Radhakrishnan N. B", blood_group: "A+", mobile_number: "9074583538" },
  { full_name: "Rajiv O. J", blood_group: "B+", mobile_number: "9744994440" },
  { full_name: "Ranjith Kumar K. M", blood_group: "A+", mobile_number: "9496604352" },
  { full_name: "Raphel M. L", blood_group: "B+", mobile_number: "9446344496" },
  { full_name: "Santhoshbabu K. G", blood_group: "O+", mobile_number: "9744464470" },
  { full_name: "Sarasan A. S", blood_group: "AB+", mobile_number: "9495248681" },
  { full_name: "Satheesh A", blood_group: "AB+", mobile_number: "9656148850" },
  { full_name: "Shaju K. L", blood_group: "O+", mobile_number: "9497804826" },
  { full_name: "Shibu M. S", blood_group: "B+", mobile_number: "8075595276" },
  { full_name: "Shiju Varghese", blood_group: "O+", mobile_number: "9446011495" },
  { full_name: "Sidharthan M. A", blood_group: "O+", mobile_number: "9961915472" },
  { full_name: "Sivan C. V", blood_group: "B+", mobile_number: "9744110715" },
  { full_name: "Sivan N. U", blood_group: "B+", mobile_number: "9495131005" },
  { full_name: "Sunildas P. B", blood_group: "O+", mobile_number: "9387690050" },
  { full_name: "Suresh Kumar A. R", blood_group: "A+", mobile_number: "9446362551" },
  { full_name: "Suresh N. G", blood_group: "O+", mobile_number: "9744861234" },
  { full_name: "Tony K.A", blood_group: "AB+", mobile_number: "9447335832" },
  { full_name: "Unnikrishnan P. K", blood_group: "O+", mobile_number: "9946369112" },
  { full_name: "Vinod K", blood_group: "O+", mobile_number: "9447319674" },
  { full_name: "Wilson O. T", blood_group: "B+", mobile_number: "9495419813" },
  { full_name: "Abdul Niyas T. K", blood_group: "B+", mobile_number: "8089605116" },
  { full_name: "Afsal S", blood_group: "B+", mobile_number: "9288858340" },
  { full_name: "Anandan P. K", blood_group: "O+", mobile_number: "9446621586" },
  { full_name: "Aneesh E. Paul", blood_group: "O-", mobile_number: "9745615219" },
  { full_name: "Anilprasad U. K", blood_group: "O+", mobile_number: "9400816467" },
  { full_name: "Babu C.K", blood_group: "O+", mobile_number: "9061456292" },
  { full_name: "Benny K. P", blood_group: "B+", mobile_number: "7907516229" },
  { full_name: "Bibin K. Vincent", blood_group: "O-", mobile_number: "9846258439" },
  { full_name: "Biju M. D", blood_group: "B+", mobile_number: "8606043570" },
  { full_name: "Binduraj V. V", blood_group: "A+", mobile_number: "9446618445" },
  { full_name: "Binoj C", blood_group: "B+", mobile_number: "9447137774" },
  { full_name: "Chandran C. K", blood_group: "B+", mobile_number: "9446359556" },
  { full_name: "Jain C. L", blood_group: "AB+", mobile_number: "9747805663" },
  { full_name: "Jeevesh M. P", blood_group: "O+", mobile_number: "9446032638" },
  { full_name: "Jideshkumar M. S", blood_group: "B+", mobile_number: "9446012246" },
  { full_name: "Jithin M. P", blood_group: "O+", mobile_number: "9526518944" },
  { full_name: "Jojo T. J", blood_group: "B+", mobile_number: "9495276408" },
  { full_name: "Krishna Prasad M. K", blood_group: "B+", mobile_number: "7012239119" },
  { full_name: "Krishnakumar V. V", blood_group: "O+", mobile_number: "8848072210" },
  { full_name: "Laiju K.A", blood_group: "B+", mobile_number: "7012833097" },
  { full_name: "Latheef K", blood_group: "B+", mobile_number: "9946094652" },
  { full_name: "Madhu M.R", blood_group: "A+", mobile_number: "9746611504" },
  { full_name: "Manikandan A", blood_group: "O+", mobile_number: "9446760321" },
  { full_name: "Mujeeb Rahjman", blood_group: "A+", mobile_number: "9744221292" },
  { full_name: "Parameswaran P", blood_group: "O+", mobile_number: "9495225590" },
  { full_name: "Rajesh E.T", blood_group: "O+", mobile_number: "9946898424" },
  { full_name: "Rajesh K. V. (Jr)", blood_group: "A+", mobile_number: "9846635134" },
  { full_name: "Ratheesh P", blood_group: "O+", mobile_number: "9946413825" },
  { full_name: "Reneesh K. H", blood_group: "B-", mobile_number: "9495934729" },
  { full_name: "Renjith K. R", blood_group: "A+", mobile_number: "9744973180" },
  { full_name: "Sajikumar P. K", blood_group: "B+", mobile_number: "8921818271" },
  { full_name: "Santhosh C. B", blood_group: "AB+", mobile_number: "9446436768" },
  { full_name: "Santhosh P. R", blood_group: "O+", mobile_number: "9656586578" },
  { full_name: "Santhosh T. K", blood_group: "B+", mobile_number: "8111811234" },
  { full_name: "Sebastian T. J", blood_group: "O+", mobile_number: "8289848171" },
  { full_name: "Shaik Ahed M. S", blood_group: "A+", mobile_number: "9744625624" },
  { full_name: "Shaji K. V", blood_group: "O+", mobile_number: "9539416296" },
  { full_name: "Shaju A. T", blood_group: "B+", mobile_number: "9447559813" },
  { full_name: "Shenny P. K", blood_group: "O+", mobile_number: "9446017176" },
  { full_name: "Sijomon P. B", blood_group: "B+", mobile_number: "9562707062" },
  { full_name: "Smibin V.M", blood_group: "O+", mobile_number: "9947091963" },
  { full_name: "Sudheerkumar M. S", blood_group: "O+", mobile_number: "9747445500" },
  { full_name: "Sunil T. R", blood_group: "A+", mobile_number: "9446342599" },
  { full_name: "Sunilkumar T. S", blood_group: "A+", mobile_number: "9446037871" },
  { full_name: "Suresh C. M", blood_group: "O+", mobile_number: "9446079375" },
  { full_name: "Sureshkumar V. S", blood_group: "O+", mobile_number: "9495552564" },
  { full_name: "Usman K.M", blood_group: "O+", mobile_number: "7736846085" },
  { full_name: "Valsaraj M. B", blood_group: "B+", mobile_number: "9446495643" },
  { full_name: "Vijayan K. K", blood_group: "B+", mobile_number: "9895898930" },
  { full_name: "Vinod K.M", blood_group: "O+", mobile_number: "9946329221" },
  { full_name: "Vishal P. V", blood_group: "A+", mobile_number: "9895021660" },
  { full_name: "Abil Antony Rinto", blood_group: "A+", mobile_number: "7902761010" },
  { full_name: "Afsal P.A", blood_group: "A+", mobile_number: "9745962352" },
  { full_name: "Abhijit S. S", blood_group: "O+", mobile_number: "7012531135" },
  { full_name: "Adarsh R. L", blood_group: "AB+", mobile_number: "9496196221" },
  { full_name: "Ajeesh E. R", blood_group: "O+", mobile_number: "8547962350" },
  { full_name: "Ajeeshkumar N. V", blood_group: "O+", mobile_number: "9946165353" },
  { full_name: "Ajithkumar A", blood_group: "B-", mobile_number: "8129936557" },
  { full_name: "Akbarsha E", blood_group: "A+", mobile_number: "9656732056" },
  { full_name: "Akhil Mohan A", blood_group: "O+", mobile_number: "9446487402" },
  { full_name: "Akshay Kumar K. U", blood_group: "A+", mobile_number: "8129973929" },
  { full_name: "Akshay Kumar M.A", blood_group: "A+", mobile_number: "9061606297" },
  { full_name: "Anand K. C", blood_group: "O+", mobile_number: "9947313320" },
  { full_name: "Anees Muhammed P. E", blood_group: "O+", mobile_number: "8848179720" },
  { full_name: "Aneesh T. C", blood_group: "B+", mobile_number: "9567692725" },
  { full_name: "Aneeshkumar R", blood_group: "B+", mobile_number: "7559865092" },
  { full_name: "Anil C. Balakrishnan", blood_group: "A+", mobile_number: "9446494039" },
  { full_name: "Anilraj P. A", blood_group: "O+", mobile_number: "8089990843" },
  { full_name: "Anoop Das P. R", blood_group: "O+", mobile_number: "8089930335" },
  { full_name: "Antony C.R", blood_group: "O+", mobile_number: "9947741058" },
  { full_name: "Anuraj C. T", blood_group: "A+", mobile_number: "9961927416" },
  { full_name: "Arjun P. R", blood_group: "O+", mobile_number: "9446949988" },
  { full_name: "Arunkumar R", blood_group: "O+", mobile_number: "9744889477" },
  { full_name: "Ashik Joseph", blood_group: "B+", mobile_number: "8086880136" },
  { full_name: "Ashik P.A", blood_group: "O+", mobile_number: "9446622072" },
  { full_name: "Benny M. O", blood_group: "A+", mobile_number: "9446047558" },
  { full_name: "Bibin Bhaskar", blood_group: "O-", mobile_number: "9847671421" },
  { full_name: "Bibin Chacko", blood_group: "O+", mobile_number: "9567221283" },
  { full_name: "Biju A. N", blood_group: "B+", mobile_number: "9446913248" },
  { full_name: "Biju K. R", blood_group: "O+", mobile_number: "9747624527" },
  { full_name: "Binish Tomy", blood_group: "A+", mobile_number: "7012277930" },
  { full_name: "Clinton A. J", blood_group: "A+", mobile_number: "9961493791" },
  { full_name: "Dhanus Krishnan R. S", blood_group: "O+", mobile_number: "9633957657" },
  { full_name: "Emmy George", blood_group: "O+", mobile_number: "8281873024" },
  { full_name: "Fijoy George T", blood_group: "B+", mobile_number: "9447785710" },
  { full_name: "Ganesan Pillai", blood_group: "A-", mobile_number: "7034960504" },
  { full_name: "Giridharan N. U", blood_group: "O+", mobile_number: "9744584866" },
  { full_name: "Hareesh V. M", blood_group: "O+", mobile_number: "9745552767" },
  { full_name: "ljas Ahammed P. K", blood_group: "O+", mobile_number: "7510322805" },
  { full_name: "Irshad P", blood_group: "O+", mobile_number: "9746214640" },
  { full_name: "Jain Mathew", blood_group: "O+", mobile_number: "9947313235" },
  { full_name: "Jaison P. Devasy", blood_group: "O+", mobile_number: "8089586785" },
  { full_name: "Janees Prins F.", blood_group: "O+", mobile_number: "8089969881" },
  { full_name: "Jayesh N. N.", blood_group: "B-", mobile_number: "9946944154" },
  { full_name: "Jerin J. O.", blood_group: "B-", mobile_number: "9539556152" },
  { full_name: "Joel Jose", blood_group: "B+", mobile_number: "9526473601" },
  { full_name: "Jose T. J", blood_group: "A+", mobile_number: "9562699827" },
  { full_name: "Joseph A", blood_group: "O+", mobile_number: "9544069899" },
  { full_name: "Joshy P. V.", blood_group: "B+", mobile_number: "9048237617" },
  { full_name: "Kaladas C. D", blood_group: "B+", mobile_number: "9048255046" },
  { full_name: "Kannan K. M.", blood_group: "A+", mobile_number: "9961531671" },
  { full_name: "Karna Anilkumar", blood_group: "O+", mobile_number: "9048001232" },
  { full_name: "Kishore Krishnan C. K.", blood_group: "O+", mobile_number: "9496910686" },
  { full_name: "Krishna Vinayak", blood_group: "O+", mobile_number: "8848499189" },
  { full_name: "Leo Johns", blood_group: "B+", mobile_number: "9633671124" },
  { full_name: "Lino P. J", blood_group: "B+", mobile_number: "9526694295" },
  { full_name: "Mahesh K. U", blood_group: "B+", mobile_number: "9895207666" },
  { full_name: "Manoj K", blood_group: "B+", mobile_number: "9895112774" },
  { full_name: "Martin Rapheal", blood_group: "B+", mobile_number: "9645045621" },
  { full_name: "Midhun Babu V", blood_group: "B+", mobile_number: "9447310580" },
  { full_name: "Mikki John M", blood_group: "A+", mobile_number: "7012092620" },
  { full_name: "Mohamed Basil P. A", blood_group: "A+", mobile_number: "9496351180" },
  { full_name: "Mohammed Dilshad V. M", blood_group: "O+", mobile_number: "7907244706" },
  { full_name: "Nidheesh K. C", blood_group: "O+", mobile_number: "9495672948" },
  { full_name: "Nidhin M. Madhavan", blood_group: "O+", mobile_number: "9633986837" },
  { full_name: "Nigeesh K. Soman", blood_group: "A+", mobile_number: "8281211968" },
  { full_name: "Nikhil Kennedy", blood_group: "O+", mobile_number: "9495023493" },
  { full_name: "Nikhil M. S", blood_group: "A+", mobile_number: "9249333575" },
  { full_name: "Noushadmon C", blood_group: "A+", mobile_number: "9744747122" },
  { full_name: "Pranesh P. P", blood_group: "B+", mobile_number: "8129941242" },
  { full_name: "Prasobh P. R", blood_group: "B+", mobile_number: "9947571867" },
  { full_name: "Praveen A. D", blood_group: "B+", mobile_number: "9400224924" },
  { full_name: "Rafi C. K.", blood_group: "O+", mobile_number: "9496419334" },
  { full_name: "Rahul M. R.", blood_group: "A+", mobile_number: "9633428826" },
  { full_name: "Rajendran C. V", blood_group: "O+", mobile_number: "9495840499" },
  { full_name: "Rajesh T.", blood_group: "O+", mobile_number: "9496866225" },
  { full_name: "Rakesh T. R", blood_group: "O+", mobile_number: "9562155435" },
  { full_name: "Ranjith K", blood_group: "O+", mobile_number: "8921425224" },
  { full_name: "Ranjith M. A", blood_group: "B+", mobile_number: "8891504344" },
  { full_name: "Ratheesh Kumar R", blood_group: "A+", mobile_number: "9809711570" },
  { full_name: "Renil Rajan E", blood_group: "O+", mobile_number: "9895070775" },
  { full_name: "Renjith K. C", blood_group: "B-", mobile_number: "8848782430" },
  { full_name: "Rihas A. S", blood_group: "O+", mobile_number: "9895262160" },
  { full_name: "Rijo C. J", blood_group: "B+", mobile_number: "9605314813" },
  { full_name: "Sabarinath P. M", blood_group: "B+", mobile_number: "9746532230" },
  { full_name: "Sabu I. V", blood_group: "A+", mobile_number: "9526563517" },
  { full_name: "Sajeesh M. S", blood_group: "B+", mobile_number: "8086814802" },
  { full_name: "Sajith Stanley", blood_group: "B-", mobile_number: "9526681855" },
  { full_name: "Sakariya M. I", blood_group: "A+", mobile_number: "9048925923" },
  { full_name: "Sameesh K. S", blood_group: "A-", mobile_number: "7306102113" },
  { full_name: "Sanath Xavier C", blood_group: "O+", mobile_number: "9048344480" },
  { full_name: "Sandeep A. S", blood_group: "A+", mobile_number: "8086681417" },
  { full_name: "Sandesh K. S", blood_group: "A+", mobile_number: "9061211455" },
  { full_name: "Saneeshkumar T. S", blood_group: "B+", mobile_number: "9496346967" },
  { full_name: "Sanish E. P", blood_group: "A+", mobile_number: "8590687045" },
  { full_name: "Santhoshkumar M. S", blood_group: "B+", mobile_number: "9745620005" },
  { full_name: "Sarath K", blood_group: "O+", mobile_number: "9744861993" },
  { full_name: "Seershendulal M. S", blood_group: "B+", mobile_number: "9495516285" },
  { full_name: "Selvy P. K", blood_group: "O+", mobile_number: "9544546894" },
  { full_name: "Shajith Nr", blood_group: "O+", mobile_number: "9645606089" },
  { full_name: "Shaju M. G", blood_group: "B+", mobile_number: "8111933050" },
  { full_name: "Shameer N", blood_group: "AB+", mobile_number: "9544407245" },
  { full_name: "Shanuj T. S", blood_group: "O+", mobile_number: "9846286030" },
  { full_name: "Shiju S", blood_group: "A+", mobile_number: "9567304539" },
  { full_name: "Shobhith O. B", blood_group: "B-", mobile_number: "8891737595" },
  { full_name: "Sijadh K. M", blood_group: "O+", mobile_number: "9544121117" },
  { full_name: "Sineesh V. L", blood_group: "B+", mobile_number: "9645311126" },
  { full_name: "Sreejith A. S", blood_group: null, mobile_number: "8086759785" },
  { full_name: "Sreemon M", blood_group: null, mobile_number: "9746362721" },
  { full_name: "Sreerag K. R", blood_group: null, mobile_number: "9061369309" },
  { full_name: "Sreeraj M. S", blood_group: null, mobile_number: "9037748818" },
  { full_name: "Subash A.M", blood_group: null, mobile_number: "9846145705" },
  { full_name: "Sudheesh R", blood_group: null, mobile_number: "8129326398" },
  { full_name: "Sunil K. P", blood_group: null, mobile_number: "9447160136" },
  { full_name: "Syam S", blood_group: null, mobile_number: "9037791339" },
  { full_name: "Thoufeeq V", blood_group: null, mobile_number: "8921899401" },
  { full_name: "Ullas C", blood_group: null, mobile_number: "9497860732" },
  { full_name: "Ullas M. S", blood_group: null, mobile_number: "9048560217" },
  { full_name: "Unnikrishnan M. R", blood_group: null, mobile_number: "8606376169" },
  { full_name: "Vaisakh M. R", blood_group: null, mobile_number: "8589065733" },
  { full_name: "Vaishnav C. A", blood_group: null, mobile_number: "9995801511" },
  { full_name: "Vinoj P.A", blood_group: null, mobile_number: "9745054916" },
  { full_name: "Vipin K. S", blood_group: null, mobile_number: "9747040355" },
  { full_name: "Vipinraj T. R", blood_group: null, mobile_number: "9645288840" },
  { full_name: "Vishnu M. G", blood_group: null, mobile_number: "9847556329" },
  { full_name: "Yadulkrishna T. U", blood_group: null, mobile_number: "7025330933" },
  { full_name: "Amitha K", blood_group: null, mobile_number: "8547388436" },
  { full_name: "Anu K", blood_group: null, mobile_number: "9656197150" },
  { full_name: "Aruna C. N", blood_group: null, mobile_number: "8089574414" },
  { full_name: "Ashira A. A", blood_group: null, mobile_number: "9633098810" },
  { full_name: "Biji P.A", blood_group: null, mobile_number: "9744609990" },
  { full_name: "Chinju Paul", blood_group: null, mobile_number: "8075625886" },
  { full_name: "Ciji C. N", blood_group: null, mobile_number: "9497803395" },
  { full_name: "Durga A.K", blood_group: null, mobile_number: "8086182046" },
  { full_name: "Farisha T. K", blood_group: null, mobile_number: "9447559436" },
  { full_name: "Hima V.J", blood_group: null, mobile_number: "9995377927" },
  { full_name: "Jayasree P", blood_group: null, mobile_number: "9497802278" },
  { full_name: "Kavya K. S", blood_group: null, mobile_number: "9605559274" },
  { full_name: "Krishna A", blood_group: null, mobile_number: "8943880736" },
  { full_name: "Lisa K. L", blood_group: null, mobile_number: "9946148370" },
  { full_name: "Neethu K. N", blood_group: null, mobile_number: "8075556549" },
  { full_name: "Nisha M. N", blood_group: null, mobile_number: "9048228016" },
  { full_name: "Nithya N. L", blood_group: null, mobile_number: "9633055062" },
  { full_name: "Nivya George", blood_group: null, mobile_number: "8078054485" },
  { full_name: "Noorja K. H", blood_group: null, mobile_number: "8157912072" },
  { full_name: "Pinky Mohandas", blood_group: null, mobile_number: "9645262311" },
  { full_name: "Praseetha M", blood_group: null, mobile_number: "9747463790" },
  { full_name: "Priya V. P", blood_group: null, mobile_number: "9847866189" },
  { full_name: "Ragi V. V", blood_group: null, mobile_number: "9995950564" },
  { full_name: "Ranju P. R", blood_group: null, mobile_number: "9744121818" },
  { full_name: "Redhika P. S", blood_group: null, mobile_number: "7025455672" },
  { full_name: "Rejitha P. S", blood_group: null, mobile_number: "9567105990" },
  { full_name: "Ruby P. B", blood_group: null, mobile_number: "9847185974" },
  { full_name: "Sabitha Y", blood_group: null, mobile_number: "9496231170" },
  { full_name: "Sajitha S", blood_group: null, mobile_number: "8547151348" },
  { full_name: "Sajitha S. Sini", blood_group: null, mobile_number: "9747350276" },
  { full_name: "Salini C. S", blood_group: null, mobile_number: "9846842100" },
  { full_name: "Sathy K. K", blood_group: null, mobile_number: "9539310925" },
  { full_name: "Sency Devassy", blood_group: null, mobile_number: "9747418416" },
  { full_name: "Sheeja T. V", blood_group: null, mobile_number: "9745233227" },
  { full_name: "Sheena N. M", blood_group: null, mobile_number: "8281259305" },
  { full_name: "Sija N. K", blood_group: null, mobile_number: "8606630304" },
  { full_name: "Smitha V. S", blood_group: null, mobile_number: "9495287784" },
  { full_name: "Sona Unni V. C", blood_group: null, mobile_number: "9544236606" },
  { full_name: "Sreevidya V. P", blood_group: null, mobile_number: "9349173441" },
  { full_name: "Sruthy C. B", blood_group: null, mobile_number: "7025361855" },
  { full_name: "Sudha A. S", blood_group: null, mobile_number: "7558915535" },
  { full_name: "Syamalatha K. S", blood_group: null, mobile_number: "9497811879" },
  { full_name: "Thasnim K. M", blood_group: null, mobile_number: "9746937237" },
  { full_name: "Abubakkar A. V", blood_group: null, mobile_number: "9847389120" },
  { full_name: "Sangeeth E. S", blood_group: null, mobile_number: "9400249369" },
  { full_name: "Shaju C. G", blood_group: null, mobile_number: "9048887816" },
  { full_name: "Sudhin V. R", blood_group: null, mobile_number: "9020997309" },
  { full_name: "Wilson K", blood_group: null, mobile_number: "9495841055" },
  { full_name: "John Jose C", blood_group: null, mobile_number: "9809286091" },
  { full_name: "Ramseena Rasak", blood_group: null, mobile_number: "9605184742" },
  { full_name: "Laigy John", blood_group: null, mobile_number: "8129166735" },
  { full_name: "Reshma Ravi K", blood_group: null, mobile_number: "7558975143" },
  { full_name: "Saju V. K", blood_group: null, mobile_number: "9947912320" },
];

// Default values for required fields
const DEFAULT_PASSWORD = "password123";

async function importUsers(req, res) {
  let successCount = 0;
  let errorCount = 0;

  try {
    // Hash default password
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // Import each user with individual transactions
    for (const user of userData) {
      const transaction = await sequelize.transaction();
      try {
        // Validate required fields
        if (!user.full_name || !user.mobile_number) {
          console.warn(`Skipping user ${user.full_name || "unknown"}: Missing required fields`);
          errorCount++;
          await transaction.rollback();
          continue;
        }

        // Check for existing mobile_number
        const existingMobile = await User.findOne({
          where: { mobile_number: user.mobile_number },
          transaction,
        });
        if (existingMobile) {
          console.warn(`Skipping user ${user.full_name}: Mobile number ${user.mobile_number} already exists`);
          errorCount++;
          await transaction.rollback();
          continue;
        }

        // Generate unique login_id
        let login_id;
        let loginIdAttempts = 0;
        const maxLoginIdAttempts = 10;
        while (!login_id && loginIdAttempts < maxLoginIdAttempts) {
          login_id = await getNextLoginId();
          const existingLoginId = await User.findOne({
            where: { login_id },
            transaction,
          });
          if (existingLoginId) {
            login_id = null;
            loginIdAttempts++;
          }
        }
        if (!login_id) {
          console.error(`Failed to generate unique login_id for ${user.full_name} after ${maxLoginIdAttempts} attempts`);
          errorCount++;
          await transaction.rollback();
          continue;
        }

        // Prepare user data
        const userRecord = {
          login_id,
          full_name: user.full_name,
          rank_id: null,
          blood_group: user.blood_group || "O+",
          last_donated_date: null,
          mobile_number: user.mobile_number,
          email: null,
          password: hashedPassword,
          date_of_birth: null,
          service_start_date: null,
          residential_address: null,
          office_id: null,
          profile_photo: null,
          is_active: true,
        };

        // Create user
        await User.create(userRecord, { transaction });
        console.log(`Successfully imported user: ${user.full_name} with login_id: ${login_id}`);
        successCount++;

        // Commit transaction
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        if (error instanceof UniqueConstraintError) {
          const field = error.errors?.[0]?.path || "unknown";
          console.error(`Unique constraint error for ${user.full_name} on field ${field}: ${error.message}`);
        } else {
          console.error(`Error importing user ${user.full_name}: ${error.message}`);
        }
        errorCount++;
      }
    }

    console.log(`User import completed. Successfully imported: ${successCount}, Errors: ${errorCount}`);
    res.send({ message: "User import completed" });
  } catch (error) {
    console.error("Error during import setup:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the import
// importUsers();

module.exports = importUsers;
