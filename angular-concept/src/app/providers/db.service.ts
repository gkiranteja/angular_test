import { Injectable } from '@angular/core';
import { db, create_cn, create_cr, create_feedbacks, create_notes } from '../db.config';
import { RequestService } from './../providers/request.service'
import { SessionTokenService } from './../providers/session-token.service'
import { 
  ASYNC_FEEDBACKS, ASYNC_NOTES, ASYNC_CN, ASYNC_CR, 
  AGET_NOTES, AGET_FEEDBACKS, AGET_CN, AGET_CR, KEY 
} from './../urls.config';
import { debug } from 'util';
let win = (window as any)

@Injectable()
export class DbService {
  db: any;
  obj: any;
  syncStatus: number = 2;
  fids: any  = [];
  notes: any = [];
  feedbacks: any = [];
  contributeNotes: any = [];
  customResearch: any = [];
  token: any;
  apigClient: any;
  lastPage: Number = 0;
  params: Object = {
    'headers': {
      'x-api-key': KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-amzn-apigateway-api-id': '6uz9oy1op3'
    }
  };

  constructor(private requestService: RequestService, private sessionTokenService: SessionTokenService) {
    this.openDBConnection();
    this.create_notes();
    this.create_feedbacks();
    this.create_cn();
    this.create_cr();
    this.token = this.sessionTokenService.getTokenAndSession();
  }

  captureFids(collection, uid, nid) {
    for(let i = 0; i < collection.length; i++) {
      this.fids[collection[i]['fid']] = {
        UID: uid,
        NID: nid,
        FID: collection[i]['fid'],
        RWNAME: '',
        Notes: '',
        Feedback: '',
        CustomResearch: '',
        ContributeNotes: '',
        ContributeCategory: '',
      }
      if(i === collection.length - 1)
        this.lastPage = collection[i]['fid']
    }
  }

  getConsolidatedNotes(uid, nid, email, n = 0) {
    if(n === 3)
      return

    let payload = {UID: uid, NID: nid};
    this.requestService.post(AGET_NOTES, payload, {
      'headers': {
        'x-api-key': KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-amzn-apigateway-api-id': '6uz9oy1op3'
      }
    }, false)
      .subscribe((data: any = []) => {
        this.notes = data['Response'];
        for(let i = 0; i < this.notes.length; i++) {
          if(!this.fids[this.notes[i]['FID']]) {
            this.fids[this.notes[i]['FID']] = {}
            this.fids[this.notes[i]['FID']]['UID'] = this.notes[i]['UID']
            this.fids[this.notes[i]['FID']]['NID'] = this.notes[i]['NID']
            this.fids[this.notes[i]['FID']]['FID'] = this.notes[i]['FID']
          }
          this.fids[this.notes[i]['FID']]['RWNAME'] = this.notes[i]['RWNAME']
          this.fids[this.notes[i]['FID']]['Notes'] = this.notes[i]['Notes']
          this.pushToLocalDb('notes', 'notes', {
            uid: uid, nid: nid, fid: this.notes[i]['FID'], value1: this.notes[i]['Notes'], email: email, 
            rwname: this.notes[i]['RWNAME']
          }, 1, null);
        }
      }, 
      err => {
        if(n === 2)
          alert('Could not get any response from the Consolidated Notes API.'); 
        this.getConsolidatedNotes(uid, nid, email, ++n);
        // for(let obj in this.fids) {
        //   this.pullFromLocalDb({uid: uid, nid: nid, fid: obj}, "", "notes", null);
        // }
      });
  }

  getConsolidatedFeedbacks(uid, nid, email, n = 0) {
    if(n === 3)
      return;
    let payload = {UID: uid, NID: nid};
    this.requestService.post(AGET_FEEDBACKS, payload, {
      'headers': {
        'x-api-key': KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-amzn-apigateway-api-id': '6uz9oy1op3'
      }
    }, false)
      .subscribe((data: any = []) => {
        this.feedbacks = data['Response'];
        for(let i = 0; i < this.feedbacks.length; i++) {
          if(!this.fids[this.feedbacks[i]['FID']]) {
            this.fids[this.feedbacks[i]['FID']] = {}
            this.fids[this.feedbacks[i]['FID']]['UID'] = this.feedbacks[i]['UID']
            this.fids[this.feedbacks[i]['FID']]['NID'] = this.feedbacks[i]['NID']
            this.fids[this.feedbacks[i]['FID']]['FID'] = this.feedbacks[i]['FID']
          }
          this.fids[this.feedbacks[i]['FID']]['Feedback'] = this.feedbacks[i]['Feedback']
          this.fids[this.feedbacks[i]['FID']]['RWNAME'] = this.feedbacks[i]['RWNAME']
          this.pushToLocalDb('feedbacks', 'feedbacks', {
            uid: uid, nid: nid, fid: this.feedbacks[i]['FID'], value1: this.feedbacks[i]['Feedback'], 
            email: email, rwname: this.feedbacks[i]['RWNAME']
          }, 1, null);
        }
      }, 
      err => {
        // for(let obj in this.fids) {
        //   this.pullFromLocalDb({uid: uid, nid: nid, fid: obj}, "", "feedbacks", null);
        // }
        if(n === 2)
          alert('Could not get any response from the Consolidated Feedbacks API.'); 
        this.getConsolidatedFeedbacks(uid, nid, email, ++n);
      });
  }

  getConsolidatedCNs(uid, nid, email, n = 0) {
    if(n === 3)
      return;
    let payload = {UID: uid, NID: nid};
    this.requestService.post(AGET_CN, payload, {
      'headers': {
        'x-api-key': KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-amzn-apigateway-api-id': '6uz9oy1op3'
      }
    }, false)
      .subscribe((data: any = []) => {
        this.contributeNotes = data['Response'];
        for(let i = 0; i < this.contributeNotes.length; i++) {
          if(!this.fids[this.contributeNotes[i]['FID']]) {
            this.fids[this.contributeNotes[i]['FID']] = {}
            this.fids[this.contributeNotes[i]['FID']]['UID'] = this.contributeNotes[i]['UID']
            this.fids[this.contributeNotes[i]['FID']]['NID'] = this.contributeNotes[i]['NID']
            this.fids[this.contributeNotes[i]['FID']]['FID'] = this.contributeNotes[i]['FID']
          }
          
          this.fids[this.contributeNotes[i]['FID']]['RWNAME'] = this.contributeNotes[i]['RWNAME']
          this.fids[this.contributeNotes[i]['FID']]['ContributeNotes'] = this.contributeNotes[i]['Contribute']
          this.fids[this.contributeNotes[i]['FID']]['ContributeCategory'] = this.contributeNotes[i]['ContributeCategory']
          this.pushToLocalDb('contribute_notes', ['contribute_notes', 'category'], {
            uid: uid, nid: nid, fid: this.contributeNotes[i]['FID'], value1: this.contributeNotes[i]['Contribute'], 
            value2: this.contributeNotes[i]['ContributeCategory'], email: email, rwname: this.contributeNotes[i]['RWNAME']
          }, 1, null);
        }
      }, 
      err => {
        // for(let obj in this.fids) {
        //   this.pullFromLocalDb({uid: uid, nid: nid, fid: obj}, "", "contribute_notes", null);
        // }
        if(n === 2)
          alert('Could not get any response from the Consolidated Contribute Notes API.'); 
        this.getConsolidatedCNs(uid, nid, email, ++n);
      });
  }

  getConsolidatedCRs(uid, nid, email, n = 0) {
    if(n === 3) 
      return;
    let payload = {UID: uid, NID: nid};
    this.requestService.post(AGET_CR, payload, {
      'headers': {
        'x-api-key': KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-amzn-apigateway-api-id': '6uz9oy1op3'
      }
    }, false)
      .subscribe((data: any = []) => {
        this.customResearch = data['Response'];
        for(let i = 0; i < this.customResearch.length; i++) {
          if(!this.fids[this.customResearch[i]['FID']]) {
            this.fids[this.customResearch[i]['FID']] = {}
            this.fids[this.customResearch[i]['FID']]['UID'] = this.customResearch[i]['UID']
            this.fids[this.customResearch[i]['FID']]['NID'] = this.customResearch[i]['NID']
            this.fids[this.customResearch[i]['FID']]['FID'] = this.customResearch[i]['FID']
          }
          this.fids[this.customResearch[i]['FID']]['RWNAME'] = this.customResearch[i]['RWNAME']
          this.fids[this.customResearch[i]['FID']]['CustomResearch'] = this.customResearch[i]['CustomResearch']
          this.pushToLocalDb('custom_research', 'custom_research', {
            uid: uid, nid: nid, fid: this.customResearch[i]['FID'], value1: this.customResearch[i]['CustomResearch'],
            email: email, rwname: this.customResearch[i]['RWNAME']
          }, 1, null);
        }
      }, 
      err => {
        // for(let obj in this.fids) {
        //   this.pullFromLocalDb({uid: uid, nid: nid, fid: obj}, "", "custom_research", null);
        // }
        if(n === 2)
          alert('Could not get any response from the Consolidated Custom Research API.'); 
        this.getConsolidatedCRs(uid, nid, email, ++n);
      });
  }

  openDBConnection() {
    this.db = win.openDatabase("trasers.db", '1.0', "Trasers local database", 5 * 1024 * 1024);
  }

  create_notes() {
    this.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS notes (uid integer, nid integer, fid integer," + 
          "notes text, rwname text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text, PRIMARY KEY(uid, nid, fid))",[],
          function(tx, success) {
          },
          function(tx, error) {
          });
    });
  }

  create_feedbacks() {
      this.db.transaction(function (tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS feedbacks (uid integer, nid integer, fid integer, feedbacks text, rwname text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text, PRIMARY KEY(uid, nid, fid))");
      });
  }

  create_cn() {
      this.db.transaction(function (tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS contribute_notes (uid integer, nid integer, fid integer, category text, rwname text, contribute_notes text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text, PRIMARY KEY(uid, nid, fid))");
      });
  }

  create_cr() {
      this.db.transaction(function (tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS custom_research (uid integer, nid integer, fid integer, custom_research text, rwname text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text, PRIMARY KEY(uid, nid, fid))");
      });
  }

  pushToLocalDb(table, fields, data, is_synced = 0, ref) {
    this.saveRecord(table, fields, data, is_synced, ref);
  }

  saveRecord(table, fields, data, is_synced = 0, ref) {
    let result = 0;
    let that = this;
    
    this.db.transaction(function (tx) {
      if(data['value1'] && data['value1'] === undefined)
        data['value1'] = ''
      if(data['value2'] && data['value2'] === undefined)
        data['value2'] = ''

      if(fields instanceof Array) {
        tx.executeSql("REPLACE INTO " + table + " (uid, nid, fid, " + fields[0] + ", " + fields[1] + ", rwname, created_date, created_by, is_edited, is_synced) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?, 1, " + is_synced + ")", 
        [data['uid'], data['nid'], data['fid'], data['value1'], data['value2'], data['rwname'], data['email']]
        , function(tx, success) {
          that.pullFromLocalDb({uid: data['uid'], nid: data['nid'], fid: data['fid']}, fields, table, ref)
          console.log(success)
        }, function(tx, error) {
          console.log(error)
        });
      } else {
        result = tx.executeSql("REPLACE INTO " + table + " (uid, nid, fid, " + fields + ", rwname, created_date, created_by, is_edited, is_synced) VALUES (?, ?, ?, ?, ?, datetime('now'), ?, 1, " + is_synced + ")", 
        [data['uid'], data['nid'], data['fid'], data['value1'], data['rwname'], data['email']]
        , function(tx, success) {
          if(Number(data['fid']) === 11363)
          that.pullFromLocalDb({uid: data['uid'], nid: data['nid'], fid: data['fid']}, fields, table, ref)
          console.log(success)
        }, function(tx, error) {
          console.log(error)
        });
      }
    });
  }

  ifRecordExists(data, field, table, ref) {
    this.obj = {}
    this.openDBConnection();
    let that = this
    // if(Number(data['fid']) === 11363)
    this.db.transaction(function (tx) {
      let sql = "SELECT * FROM " + table + " where uid = '" + data['uid'] + ""
      + "' and nid = '" + data['nid'] + "' and fid = '" + data['fid'] + "'";
      let result = tx.executeSql("SELECT * FROM " + table + " where uid = '" + data['uid'] + ""
      + "' and nid = '" + data['nid'] + "' and fid = '" + data['fid'] + "'", 
      [], function(tx, results) {
          if(results.rows.length > 0) {
            // if(Number(data['fid']) === 11363)
            that.obj = {
              UID: results.rows[0]['uid'],
              NID: results.rows[0]['nid'],
              FID: results.rows[0]['fid'],
              RWID: 888,
              RWNAME: results.rows[0]['rwname'],
              CreatedBy: results.rows[0]['created_by'],
              CreatedDate: results.rows[0]['created_date'],
            };
            if(!that.fids[results.rows[0]['fid']]) {
                that.fids[results.rows[0]['fid']] = that.obj;
            }
            if(table == "notes") {
              // if(Number(data['fid']) === 11363)
        
              that.obj['Notes'] = results.rows[0]['notes'];                
              that.fids[results.rows[0]['fid']]['Notes'] = results.rows[0]['notes']
              if(ref) {
                ref.showNotesData = that.obj
                ref.changeDetectorRef.detectChanges()
              }
            } else if(table == 'feedbacks') {
              that.obj['Feedback'] = results.rows[0]['feedbacks'];
              that.fids[results.rows[0]['fid']]['Feedback'] = results.rows[0]['feedbacks']
              if(ref) {
                ref.showFeedbackData = that.obj;
                ref.changeDetectorRef.detectChanges()
              }
            } else if(table == 'custom_research') {
              that.obj['CustomResearch'] = results.rows[0]['custom_research'];
              that.fids[results.rows[0]['fid']]['CustomResearch'] = results.rows[0]['custom_research']
              if(ref){
                ref.showCustomResearchData = that.obj;
                ref.changeDetectorRef.detectChanges()
              }
            } else if(table == 'contribute_notes') {
              that.obj['ContributeNotes'] = results.rows[0]['contribute_notes'];
              that.obj['ContributeCategory'] = results.rows[0]['category'];
              that.fids[results.rows[0]['fid']]['ContributeNotes'] = results.rows[0]['contribute_notes']
              that.fids[results.rows[0]['fid']]['ContributeCategory'] = results.rows[0]['category']
              if(ref) {
                ref.selectedOption = that.obj['ContributeCategory'];
                ref.selectedOptionValue = that.obj['ContributeCategory'];
                ref.showContributeNotesData = that.obj;
                ref.changeDetectorRef.detectChanges()
              }
            }
          }
      },
      function(tx, error) {
        console.log("******************PULL ERROR****************************");
        console.log(error)
      });
    });
    return this.obj;
  }

  pullFromLocalDb(data, field, table, ref) {
    this.ifRecordExists(data, field, table, ref)
  }

  syncWithRemoteDb() {    
    this.syncStatus = 1;
    let table = "notes"
    let fields = "notes as Notes"
    this.captureDataFromLocalDb(ASYNC_NOTES, table, fields);
    table = "feedbacks"
    fields = "feedbacks as Feedback"
    this.captureDataFromLocalDb(ASYNC_FEEDBACKS, table, fields);
    table = "contribute_notes"
    fields = "contribute_notes as ContributeNotes, category as ContributeCategory"
    this.captureDataFromLocalDb(ASYNC_CN, table, fields);
    table = "custom_research"
    fields = "custom_research as CustomResearch"
    this.captureDataFromLocalDb(ASYNC_CR, table, fields);
  }

  captureDataFromLocalDb(api, table, fields) {
    let rows = []
    let that = this
    this.db.transaction(function (tx) {
      tx.executeSql("SELECT * FROM " + table + " where is_edited = ? and (is_synced is NULL or is_synced = 0)", 
      [1], function(tx, results) {
          if(results.rows.length > 0) {
            let objs = [];
            let date = new Date().toISOString();
            let dtt = date.split('T')[0]
            let tmm = date.split('T')[1].split('.')
            let datetime = dtt + " " + tmm[0]
            for(let i = 0; i < results.rows.length; i++) {
              let obj = {
                UID: results.rows[i]['uid'],
                NID: results.rows[i]['nid'],
                FID: results.rows[i]['fid'],
                RWID: 888,
                RWNAME: results.rows[i]['rwname'], 
                CreatedBy: results.rows[i]['created_by'],
                CreatedDate: datetime,
                // results.rows[i]['created_date']
              }
              if(api == ASYNC_NOTES) {
                obj['Notes'] = results.rows[i]['notes']
              } else if (api == ASYNC_FEEDBACKS) {
                obj['Feedback'] = results.rows[i]['feedbacks']
              } else if (api == ASYNC_CR) {
                obj['CustomResearch'] = results.rows[i]['custom_research']
              } else if (api == ASYNC_CN) {
                obj['Contribute'] = results.rows[i]['contribute_notes']
                obj['ContributeCategory'] = results.rows[i]['category']
              }
              objs.push(obj)
            }
            that.syncData(objs, table, api);
          }
      }, 
      function(tx, error) {
      });
    });
    return rows;
  }

  syncData(rows, table, API, n = 0) {
    if(n === 3)
      return;
    this.requestService.post(API, rows, {
      'headers': {
        'x-api-key': KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-amzn-apigateway-api-id': '6uz9oy1op3'
      }
    }).subscribe((data: any = []) => {
      if(data.length > 0) {
        for(let i = 0; i < data.length; i++) {
          if(data[i].IsError != null) {
            //this.revertSyncStatus(data[i]['FID'], table);
          } else {
            this.changeSyncStatus(data[i]['FID'], table);
          }
        }
        this.syncStatus = 2;
      }
    }, 
    err => {
      if(API === ASYNC_NOTES && n === 2) {        
        alert('Could not get any response from the server. Some of your offline notes data may get lost.');
      } else if(API === ASYNC_FEEDBACKS && n === 2) {
        alert('Could not get any response from the server. Some of your offline feedbacks data may get lost.');
      } else if(API === ASYNC_CR && n === 2) {
        alert('Could not get any response from the server. Some of your offline custom research data may get lost.');
      } else if(API === ASYNC_CN && n === 2) {
        alert('Could not get any response from the server. Some of your offline contribute notes data may get lost.');
      }
      this.syncData(rows, table, API, ++n);
    })
  }

  revertSyncStatus(fid, table) {
    this.db.transaction(function (tx) {
      tx.executeSql("UPDATE " + table + " SET is_synced = 0 WHERE fid = ?", [fid]);
    });
  }

  changeSyncStatus(fid, table) {
    this.db.transaction(function (tx) {
      tx.executeSql("UPDATE " + table + " SET is_synced = 1 WHERE fid = ?", [fid],
      function(tx, success) {
        
      }, 
      function(tx, error) {
        
      });
    });
  }

}