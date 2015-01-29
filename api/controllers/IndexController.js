/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `IndexController.index()`
   */
  index: function (req, res) {
    var mc = require('minecraft-protocol');
    var serverList = [
      {
        host: 'matrixcraft.no-ip.info',
        port: 25565
      }
      ,
      {
        host: 'matrixcraft.no-ip.info',
        port: 25567
      }
    ];
    
    var count = 0;
    var ret = [];
    var ping = function(serverItem) {
      return function(err, data) {
        var retData;
        if(err) {
          retData = {
            port: serverItem.port,
            error: err
          };
        } // endif...
        else {
          retData = {
            serverName: data.description,
            port: serverItem.port,
            version: data.version,
            latency: data.latency,
            players: {
              max: data.players.max,
              online: data.players.online,
              list: []
            }
          };
          
          for(var key in data.players.sample) {
            retData.players.list.push(data.players.sample[key].name);
          } // endfor
          
        } // endelse
        
        ret.push(retData);
        count += 1;
        
        if(count >= serverList.length) {
          return res.json(ret);
        }
      };
    };
    
    for(var key in serverList) {
      mc.ping(serverList[key], ping(serverList[key]));
    }
  }
};

