var mysql = require("mysql");
var util = require("util")
function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    // 注册员工
    router.post("/employee_regist",function(req,res){
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = ["employee_login","employee_name","employee_mobile","employee_email","employee_password",req.body.employee_name, req.body.employee_mobile, req.body.employee_email, req.body.employee_password];
        query = mysql.format(query,table);


        var query_exist= "SELECT * from ?? WHERE ?? = ? OR ?? = ?";
        var table_exist=["employee_login","employee_mobile",req.body.employee_mobile,"employee_email",req.body.employee_email]
        query_exist = mysql.format(query_exist,table_exist);
      
        connection.query(query_exist,function(err,rows){
            if(err) {
                res.send(err)
            } else {
                    console.log(req.body)
                   if(rows == ''){
                    // res.send('注册成功')
                    connection.query(query,function(err,rows){
                        if(err) {
                            res.send(err)
                            // res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                        } else {
                            res.json({"Error" : false, "Message" : "注册成功 !"});
                        }
                    });
                   }
                   else{
                       res.send('已经注册过')
                   }
 
            }
        });
    });

    // 员工登陆
    router.post("/employee_login",function(req,res){
        var query = "select * from ?? where ?? = ? and ?? = ?";
        var table = ["employee_login","employee_mobile", req.body.employee_mobile, "employee_password", req.body.employee_password];
        query = mysql.format(query,table);
        
        connection.query(query,function(err,rows){
            if(err) {
                res.send(err)
            } else {
                if(rows==''){
                    res.send('1')
                }else{
                    res.send(rows)
                }
            }
        });
    });

    // 提交活动表单
    router.post("/event_submit",function(req,res){
        var query = "INSERT INTO ??(??,??,??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var table = ['event_info',
        "event_member_id","event_name","event_time","event_type",
        "event_shengfen",'event_shengfen2','event_city','event_apply_part','event_apply_member',
        'event_location','event_loaction_type','event_address_detail','event_listener_type',
        'event_listenr_num','event_host_name',
        req.body.event_member_id, req.body.event_name, req.body.event_time, req.body.event_type,
        req.body.event_shengfen, req.body.event_shengfen2,req.body.event_city, req.body.event_apply_part, req.body.event_apply_member,
        req.body.event_location, req.body.event_loaction_type, req.body.event_address_detail, req.body.event_listener_type,
        req.body.event_listenr_num, req.body.event_host_name ];
        query = mysql.format(query,table);
      
        connection.query(query,function(err,rows){
            if(err) {
                res.send(err)
            } else {
                // res.send(rows)
                res.send({"Error" : false, "Message" : "Success", "event_info" : rows});
            }
        });
    });

    // 活动历史数据
    router.get("/event_history/:event_member_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ?? = ?";
        var table = ["event_info",'event_member_id',req.params.event_member_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.send(rows)
            }
        });
    });

    // 提交活动客户
    router.post("/add_event_member",function(req,res){
        var query = "INSERT INTO event_member(event_member_employee_id,event_member_event_num,event_member_name,event_member_sex,event_member_contact_type,event_member_contact_info,event_member_contact_type2,event_member_contact_info2) VALUES ? ";
        connection.query(query,[req.body],function(err,rows){
            if(err) {
                res.send(err)
            } else {
                res.send('0')
            }
        });
    });

    router.put("/users",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
            }
        });
    });
    
    router.delete("/users/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user_login","user_email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
            }
        });
    });
}

module.exports = REST_ROUTER;