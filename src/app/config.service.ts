import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UserLoginForm } from './user.interface';
import { Round } from './round.interface';
import { RoundGroup } from './round-group.interface';
import { Game } from './game.interface';
import { Prize } from './prize.interface';
import { Bet } from './bet.interface';
import { Jurisdiction } from './jurisdiction.interface';
import { Contact } from './contact.interface';
import { Report } from './report.interface';
import { ReportFilter } from './report-filter.interface';
import { Transaction } from './transaction.interface';
import { Banner } from './banner.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiUrl = 'http://api.socialawp.com';
  //apiUrl = 'https://localhost:44341';

  constructor(private http: HttpClient) { }

  getLogin(log: string, pass: string): Observable<any>{
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    const loginObj = { login: log, password: pass};

    return this.http.post(this.apiUrl + '/users/login', loginObj, { headers: header });

  }

  checkLogged(key: string){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post(this.apiUrl + '/common/LoginDencryption/?key=' + key, { headers: header });
  }

  listUsers(){
    return this.http.get<User[]>(`${this.apiUrl}/users/`);
  }

  getUser(userId: number){
    return this.http.get<User>(`${this.apiUrl}/users/` + userId);
  }

  getUserTree(userId: number){
    return this.http.get<User>(`${this.apiUrl}/common/GetUserTree?userId=`+userId);
  }

  getUsersTreeList(userId: number){
    return this.http.get<User[]>(`${this.apiUrl}/common/GetUsersTreeList?userId=`+userId);
  }

  GetJurisdictionLevelByUser(userId: number, jurisditicionLevel: number){
    return this.http.get<User[]>(`${this.apiUrl}/common/GetJurisdictionLevelByUser?userId=`+userId+'&jurisdictionLevel='+jurisditicionLevel);
  }

  getJurisdictionsById(jurisdictionId: number){
    return this.http.get<Jurisdiction[]>(`${this.apiUrl}/common/GetJurisdictionsById?jurisdictionId=`+jurisdictionId);
  }

  updateUserCredit(fromUserId: number, credit: number, transactionType: number, toUserId: number = 0){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    //return this.http.put<any>(`${this.apiUrl}/common/UpdateCreditTransfer/?userId=`+userId, credit, { headers: header });
    return this.http.put<any>(`${this.apiUrl}/common/UpdateCreditTransfer/?fromUserId=`+fromUserId+'&toUserId='+toUserId+'&credit='+credit+'&transactionType='+transactionType, { headers: header });
  }

  updateUser(userId: number, user: User){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "Id": user.id,
      "Name": user.name,
      "LastName": user.lastName,
      "Email": user.email,
      "Login": user.login,
      "Password": user.password,
      "Deleted": user.deleted,
      "Commission": user.commission,
      "ParentId": user.parentId,
      "JurisdictionId": user.jurisdictionId,
      "Country": user.country,
      "City": user.city,
      "Credit": user.credit
    }

    console.log("senha: " + jsonToPass.Password);

    return this.http.put<User>(this.apiUrl + '/users/'+ userId, jsonToPass, { headers: header });
  }

  getPrize(){
    return this.http.get<Prize>(`${this.apiUrl}/prizes/`);
  }

  getRoundJackpot(roundId: number){
    return this.http.get<Prize>(`${this.apiUrl}/common/GetRoundJackpot/?roundId=` + roundId);
  }

  updateRoundJackpot(newJackpot: Prize){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.put<Prize>(this.apiUrl + '/common/UpdateRoundJackpot/?roundId=' + newJackpot.roundId, newJackpot, { headers: header });
  }

  updateJackpot(newJackpot: Prize){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    // ATTENTION: for now, passing always param 2 because it's jackpot on current prizes table at db
    return this.http.put<Prize>(this.apiUrl + '/prizes/2', newJackpot, { headers: header });
  }

  updateApportionment(newApportionment: Prize){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    // ATTENTION: for now, passing always param 2 because it's jackpot on current prizes table at db
    return this.http.put<Prize>(this.apiUrl + '/prizes/3', newApportionment, { headers: header });
  }

  getRounds(){
    return this.http.get<Round[]>(`${this.apiUrl}/rounds/`);
  }

  getActivatedRoundGroups(){
    return this.http.get<RoundGroup[]>(`${this.apiUrl}/roundgroups/`);
  }

  getAllRoundGroups(){
    return this.http.get<RoundGroup[]>(`${this.apiUrl}/common/GetAllRoundGroups/`);
  }

  addRoundGroup(newRoundGroup: string, jurisdictionFather: number){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<RoundGroup>(this.apiUrl + '/common/AddRoundGroup/?newRoundGroup=' + newRoundGroup + "&jurisdictionFather=" + jurisdictionFather, { headers: header });
  }

  getListedRoundGroups(){
    return this.http.get<RoundGroup[]>(`${this.apiUrl}/common/GetListedAllRoundGroups/`);
  }

  getLastRound(){
    return this.http.get<Round>(`${this.apiUrl}/common/getlastround`);
  }

  getRound(roundId: number){
    return this.http.get<Round>(`${this.apiUrl}/rounds/` + roundId);
  }

  getRoundsFinished(){
    return this.http.get<Round[]>(`${this.apiUrl}/common/GetRoundFinished`);
  }

  getRoundsOpended(){
    return this.http.get<Round[]>(`${this.apiUrl}/common/GetRoundOpened`);
  }

  getRoundsPosted(){
    return this.http.get<Round[]>(`${this.apiUrl}/common/GetRoundPosted`);
  }

  createRound(roundValue: number, newGames: Game[]){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/common/PostNewRound/?roundValue=` + roundValue, newGames, { headers: header });
  }

  postResult(games: Game[]){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/common/PostResult/`, games, { headers: header });
  }

  getBet(betId: number){
    return this.http.get<Bet>(`${this.apiUrl}/bets/` + betId);
  }

  getBets(roundId: number){
    return this.http.get<Bet[]>(`${this.apiUrl}/common/GetActivatedBetsByRound/?roundId=` + roundId);
  }

  getBetsByUserTree(userAdminId: number, roundId: number){

    return this.http.get<Bet[]>(`${this.apiUrl}/common/GetBetsByUserTree/?userAdminId=` + userAdminId + "&roundId=" + roundId);
  }

  getAllBets(roundId: number){
    return this.http.get<Bet[]>(`${this.apiUrl}/common/GetBetsByRound/?roundId=` + roundId);
  }

  getLastUserBet(userId: number){
    return this.http.get<Bet>(`${this.apiUrl}/common/GetLastUserBet/?userId=` + userId);
  }

  postBet(bet: any){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "betDate": bet.date,
      "resultBetId": 1,
      "playerId": 1,
      "playerName": bet.playerName,
      "roundId": bet.roundId,
      "userAdminId": bet.userId,
      "results": bet.resultToPass,
      "status": 1,
      "value": bet.value
    }

    return this.http.post<Bet>(this.apiUrl + '/bets/', jsonToPass, { headers: header });
  }

  updateBet(bet: Bet){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "id": bet.id,
      "betDate": bet.betDate,
      "resultBetId": bet.resultBetId,
      "playerId": bet.playerId,
      "playerName": bet.playerName,
      "roundId": bet.roundId,
      "userAdminId": bet.userAdminId,
      "results": bet.results,
      "value": bet.value
    }

    return this.http.put<Bet>(`${this.apiUrl}/bets/` + bet.id, bet, { headers: header });
  }

  getGames(roundId: number){
    return this.http.get<Game[]>(`${this.apiUrl}/common/GetMatchesByRound/?roundId=` + roundId);
  }

  createGame(newGame: Game) {
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "betradarMatchId" : newGame.betradarMatchId,
      "HomeName" : newGame.homeName,
      //"AwayTeamId" : newGame.awayTeamId,
      "AwayName" : newGame.awayName,
      "RoundId" : newGame.roundId,
      "BetradarMatchId" : 0,
      "AwayTeamScore" : 0,
      "DateTime" : newGame.dateTime
    };

    return this.http.post<Game>(this.apiUrl + '/matches/', jsonToPass, { headers: header });
  }

  /*
  updateMatches(games: Array<Game>){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.put<Game[]>(`${this.apiUrl}/matches/UpdateMatches/`, games, { headers: header });
  }
  */

  listRoundWinners(roundId: number){
    return this.http.get<any[]>(`${this.apiUrl}/common/GetWinnersByRound/?roundId=` + roundId);
  }

  addJurisdiction(newJurisdiction: Jurisdiction){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<Jurisdiction>(this.apiUrl + '/jurisdictions/', newJurisdiction, { headers: header });
  }

  addNewUser(user: UserLoginForm){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<Jurisdiction>(`${this.apiUrl}/users/`, user, { headers: header });
  }

  createUser(user: User){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<User>(`${this.apiUrl}/users/`, user, { headers: header });
  }

  sendPasswordToEmail(name: string, login: string, email: string, password: string){
    return this.http.get(`${this.apiUrl}/common/SendPasswordMail/?name=` + name + "&login=" + login + "&email=" + email + "&password=" + password);
  }

  sendRecoveryPassword(email: string){
    return this.http.get(`${this.apiUrl}/common/RecoveryPasswordMail/?email=` + email);
  }

  removeUser(userId: number){
    return this.http.delete<User>(`${this.apiUrl}/users/` + userId);
  }

  sendContactMessage(contact: any){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    //onsole.log("nome: " + contact.name + " - email: " + contact.email + " - assunto: " + contact.subject + " - msg: " + contact.message);

    return this.http.get(`${this.apiUrl}/common/SendContactMessage/?name=`+contact.name +
      "&email="+contact.email+"&subject="+contact.subject+"&message="+contact.message, { headers: header });
  }

  getUnreadMessages(){
    return this.http.get<Contact[]>(`${this.apiUrl}/contacts/`);
  }

  getReport(filter: ReportFilter){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<Report[]>(`${this.apiUrl}/common/GetReport/`, filter, { headers: header });
  }

  postBanner(banner: FormData, userId: number, title: string, subtitle: string){

    return this.http.post(`${this.apiUrl}/common/SendBanner/?userId=` + userId +
      "&title=" + title + "&subtitle=" + subtitle, banner);
  }

  /*
  getBanners(){
    return this.http.get<any[]>(`${this.apiUrl}/banners/`);
  }
  */
  getMasterParent(userId: number){
      return this.http.get<User>(`${this.apiUrl}/common/GetMasterParent/?userId=` + userId);
  }

  getOwnBanners(userId: number){
    return this.http.get<Banner[]>(`${this.apiUrl}/common/GetOwnBanners/?userId=`+userId);
  }

  saveBannerState(userId: number, banners: Banner[]){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/common/SaveBannersState/?userId=`+userId, banners, { headers: header });
  }

  deleteBanner(bannerId: number, userId: number){

    return this.http.delete(`${this.apiUrl}/banners/`+bannerId+'/?userId='+userId );
  }

  GetBetradarMatches(idCompetition: number){
    return this.http.get(`${this.apiUrl}/common/GetBetradarMatches/?idCompetition=`+idCompetition);
  }

  getBetRadarCompetitions(){
    return this.http.get('../../assets/data/betradar-list.json');
  }

  getBetRadarResults(games: Game[]){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<Game[]>(`${this.apiUrl}/common/GetBetradarResults/`, games, { headers: header });
  }

  getTransactionsByUserId(userId){
    return this.http.get<Transaction[]>(`${this.apiUrl}/common/GetTransactions/?userId=` + userId);
  }

}
