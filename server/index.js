const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { AuthenticationMD5Password } = require("pg-protocol/dist/messages");

//middleware
app.use(cors());
app.use(express.json());

//Routes

//Thêm tài khoản admin

//Get a account
app.get("/getadmin/:id_admin", async(req,res)=>{
    try {
        const {id_admin} = req.params;
        const account = await pool.query("SELECT * FROM account WHERE id_admin = $1", [id_admin]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all account
app.get("/getadmin", async(req, res)=>{
    try {
        const allgetadmin =await pool.query("SELECT * FROM account");
        res.json(allgetadmin.rows);
    } catch (error) {
        console.error(error.message);
    }
})

//Update account
app.put("/updateadmin/:id_admin",async(req,res)=>{
    try {
        const {id_admin} = req.params;
        const {hotendem, ten, sdt, email, facebook, password} = req.body;
        const updateKh =await pool.query(`
            UPDATE account SET 
                hotendem = $1, ten=$2, sdt=$3, email=$4, facebook=$5, password=$6 WHERE id_admin = $7
        `, [hotendem, ten, sdt, email, facebook, password,id_admin]);
        
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
})

//Tìm tài khoản và mật khẩu thỏa mãn
app.post("/finduserpassadmin", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {username, password} = req.body;
        const newAccount = await pool.query(
            "SELECT id_admin FROM account WHERE username = $1 AND password = $2",
            [username, password]
        );
        console.log('req:', req.body);
        if (newAccount.rows.length==0)
            res.send(false);
        else res.json(newAccount.rows[0].id_admin);

    } catch (error) {
    console.log('error :', error.message);
    }
});

//Tìm tài khoản và mật khẩu thỏa mãn
app.post("/finduserpassclient", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {username, password} = req.body;
        const newAccount = await pool.query(
            "SELECT id_kh FROM khachhang WHERE username = $1 AND password = $2",
            [username, password]
        );
        console.log('req:', req.body);
        if (newAccount.rows.length==0)
            res.send(false);
        else res.json(newAccount.rows[0].id_kh);

    } catch (error) {
    console.log('error :', error.message);
    }
});

//Them Khach Hang
app.post("/addadmin", async(req,res)=>{
    try {
        const {username, password, hotendem, ten, sdt, email, facebook} = req.body;
        const newKH = await pool.query(
            "INSERT INTO account(username, password, hotendem, ten, sdt, email, facebook) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [username, password, hotendem, ten, sdt, email, facebook]
        );
    
        res.json(newKH.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Tìm tài khoản và mật khẩu thỏa mãn (admin)
app.post("/finduseradmin", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {username} = req.body;
        const newAccount = await pool.query(
            "SELECT id_admin FROM account WHERE username = $1",
            [username]
        );
        console.log('req:', req.body);
        if (newAccount.rows.length!=0)
            res.send(true);
        else res.json(false);

    } catch (error) {
    console.log('error :', error.message);
    }
});

//Thêm nhà văn hóa
app.post("/addnvh", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {ten_nvh, diachi, thon_xom, xa_phuong, quan_huyen, tinh_tp, giathue} = req.body;
        const nhavanhoa = await pool.query(
            "INSERT INTO nhavanhoa(ten_nvh, diachi, thon_xom, xa_phuong, quan_huyen, tinh_tp) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [ten_nvh, diachi, thon_xom, xa_phuong, quan_huyen, tinh_tp, giathue]
        );
    
        res.json(nhavanhoa.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})
//Thêm nhà văn hóa trống
app.post("/addnvhtrong", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {id_admin} = req.body;
        const nhavanhoa = await pool.query(
            "INSERT INTO nhavanhoa(ten_nvh, diachi, thon_xom, xa_phuong, quan_huyen, tinh_tp) VALUES ('no name','','','','','') RETURNING *",
        );
    
        res.json(nhavanhoa.rows[0].id_nvh);
        const id_nvh = nhavanhoa.rows[0].id_nvh;
        const quanly = await pool.query(
            "INSERT INTO quanly(id_nvh, id_admin, root) VALUES ($1,$2,1) RETURNING *",[id_nvh, id_admin],
        );
        console.log('req:', req.body);
    } catch (error) {
    console.log('error :', error.message);
    }
})
//Update nha van hoa

// localhost/updatenvh/1
app.put("/updatenvh/:id_nvh",async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const {ten_nvh, thon_xom, xa_phuong, quan_huyen,tinh_tp, diachi, gioithieu, avatar, bando, so_phong, dientich} = req.body;
        const updateTodo =await pool.query(
            "UPDATE nhavanhoa SET ten_nvh = $1, diachi = $2, thon_xom = $3, xa_phuong = $4, quan_huyen = $5, tinh_tp = $6, gioithieu = $7, avatar = $8, bando = $9, so_phong = $10, dientich=$11  WHERE id_nvh = $12", 
            [ten_nvh, diachi, thon_xom, xa_phuong, quan_huyen, tinh_tp, gioithieu, avatar, bando, so_phong, dientich, id_nvh]);
        
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
})


//Get nhavanhoa
app.get("/getnvh/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const account = await pool.query("SELECT * FROM nhavanhoa WHERE id_nvh = $1", [id_nvh]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all nhavanhoa
app.get("/getnvh", async(req,res)=>{
    try {
        const account = await pool.query("SELECT * FROM nhavanhoa");
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })
//Get all nhavanhoa va phong
app.get("/getallnvhvaphong", async(req,res)=>{
    try {
        const account = await pool.query("SELECT * FROM nhavanhoa JOIN phong USING(id_nvh)");
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all nhavanhoa va phong voi dieu kien
app.put("/getallnvhvaphongvoidieukien", async(req,res)=>{
    try {
        const {cost1, cost2, people1, people2, star1, star2, tinh, huyen, xa, keyword} = req.body;
        const account = await pool.query(`
            SELECT * FROM nhavanhoa nvh JOIN phong p USING(id_nvh)
            WHERE p.gia>=$1 AND p.gia<=$2 AND so_nguoi>=$3 AND so_nguoi<=$4 AND p.so_sao_tb>=$5 AND p.so_sao_tb<=$6
            and nvh.tinh_tp ilike $7 
            and nvh.quan_huyen ilike $8
            and nvh.xa_phuong ilike $9
            and nvh.ten_nvh ilike $10             
            `,[cost1, cost2, people1, people2, star1, star2, tinh, huyen, xa, keyword]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })



//Get all nhavanhoa ma khong duoc quan ly boi id admin nay
app.get("/getelsenvh&anhnvhfromadmin/:id_admin", async(req,res)=>{
    try {
        const{id_admin} =req.params;
        const account = await pool.query(`
        SELECT  n.id_nvh, n.ten_nvh, avatar
            FROM nhavanhoa n
        EXCEPT
        SELECT  n.id_nvh, n.ten_nvh, avatar
            FROM nhavanhoa n
            JOIN quanly q USING(id_nvh) 
                WHERE q.id_admin = $1 AND q.root!='0'`,[id_admin]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })   

//Get all nhavanhoa va anhnvh
app.get("/getnvh&anhnvh", async(req,res)=>{
    try {
        const account = await pool.query("SELECT * FROM nhavanhoa LEFT JOIN anhnvh USING(id_nvh) WHERE loai='a'");
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all anhnvh from id_nvh 
app.get("/getnvh&anhnvh/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const account = await pool.query("SELECT src FROM nhavanhoa LEFT JOIN anhnvh USING(id_nvh) WHERE id_nvh = $1",[id_nvh]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all from id_phong 
app.get("/getphong/:id_phong", async(req,res)=>{
    try {
        const {id_phong} = req.params;
        const account = await pool.query("SELECT * FROM phong WHERE id_phong = $1",[id_phong]);
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get tattantat from id_phong 
app.get("/getbinhluanphong/:id_phong", async(req,res)=>{
    try {
        const {id_phong} = req.params;
        const account = await pool.query(`
        SELECT * FROM 
            phong p
                JOIN binhluan b USING(id_phong)
                JOIN khachhang k USING(id_kh)
            WHERE id_phong = $1`,[id_phong]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get sao from id_phong 
app.get("/getsaophong/:id_phong", async(req,res)=>{
    try {
        const {id_phong} = req.params;
        const account = await pool.query(`
        select
  id_phong,
  count(case when danh_gia_sao='5' then 1 end) as nam_sao,
  count(case when danh_gia_sao='4' then 1 end) as bon_sao,
  count(case when danh_gia_sao='3' then 1 end) as ba_sao,
  count(case when danh_gia_sao='2' then 1 end) as hai_sao,
  count(case when danh_gia_sao='1' then 1 end) as mot_sao,
  count(*) as tong_sao_danh_gia
from binhluan
where id_phong=$1
group by id_phong;`,[id_phong]);
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })





//Get all nhavanhoa, anh nvh (a) from id
app.get("/getnvh&anhnvhfromadmin/:id_admin", async(req,res)=>{
    try {
        const {id_admin} = req.params;
        const account = await pool.query(
            `SELECT a.ten, n.id_nvh, n.ten_nvh, avatar  
            FROM account a
                JOIN quanly q USING(id_admin) 
                JOIN nhavanhoa n USING(id_nvh)  
            WHERE a.id_admin = $1 AND q.root!='0'`,
            [id_admin]);
   
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get nhavanhoa, anh nvh(a) from id_nvh & id_admin
app.get("/getnvhfromadmin/:id_admin/:id_nvh", async(req,res)=>{
    try {
        const {id_admin, id_nvh} = req.params;
        const account = await pool.query(
            `SELECT *  
            FROM account a
                JOIN quanly q USING(id_admin) 
                JOIN nhavanhoa n USING(id_nvh)  
            WHERE a.id_admin = $1 AND n.id_nvh = $2 AND q.root!='0'`,
            [id_admin, id_nvh]);
   
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get anh from id_phong
app.get("/getanhphong/:id_phong", async(req,res)=>{
    try {
        const {id_phong} = req.params;
        const account = await pool.query(
            `SELECT *  
            FROM phong p 
                JOIN anhnvh USING(id_phong) 
            WHERE p.id_phong = $1`,
            [id_phong]);
   
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })



//Get all phong from id_nvh
app.get("/getallphong/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const account = await pool.query(
`SELECT * FROM phong p JOIN nhavanhoa n USING(id_nvh) WHERE n.id_nvh = $1`,[id_nvh]);
            
        res.json(account.rows);

        console.log('res.json:', res.json);
    } catch (error) {
        console.error(error.message);
    }
   })


//Them quan ly
app.post("/addquanly", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {id_admin, id_nvh, root} = req.body;
        const quanly = await pool.query(
            "INSERT INTO quanly(id_admin, id_nvh, root) VALUES ($1,$2,$3) RETURNING *",
            [id_admin, id_nvh, root]
        );
    
        res.json(quanly.rows[0]);
        console.log('res:', res.status);    
        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    res.sendStatus(200)
    }
})


//Thêm ảnh vào anhnvh
app.post("/addanhnvh", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {id_nvh,src, id_phong} = req.body;
        const anhnvh = await pool.query(
            "INSERT INTO anhnvh(id_nvh,src, id_phong) VALUES ($1,$2,$3) RETURNING *",
            [id_nvh,src, id_phong]
        );
    
        res.json(anhnvh.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Update phòng
app.put("/updatephong/:id_phong",async(req,res)=>{
    try {
        const {id_phong} = req.params;
        const {id_nvh, gia, dien_tich, so_nguoi, mieu_ta, loai_phong, avatarphong} = req.body;
        const updateCsvc =await pool.query(
            "UPDATE phong SET id_nvh = $1, gia = $2, dien_tich = $3, so_nguoi = $4, mieu_ta = $5, loai_phong = $6, avatarphong=$7 WHERE id_phong = $8", 
            [id_nvh, gia, dien_tich, so_nguoi, mieu_ta, loai_phong, avatarphong, id_phong]);
        
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
})
//Thêm phòng trống
app.post("/addphongtrong/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const newPhong = await pool.query(
            "INSERT INTO phong(id_nvh, gia, dien_tich, so_nguoi, loai_phong) VALUES ($1, 0, 0, 0, 'Empty') RETURNING *",[id_nvh],
        );
        res.json(newPhong.rows[0].id_phong);
        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Thêm cơ sở vật chất
app.post("/addcsvc", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {id_phong, ten_csvc, giatri, giathue_csvc, mieuta, soluong, anhcsvc} = req.body;
        const newCSVC = await pool.query(
            "INSERT INTO cosovatchat(id_phong, ten_csvc, giatri, giathue_csvc, mieuta, soluong, anhcsvc) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [id_phong, ten_csvc, giatri, giathue_csvc, mieuta, soluong, anhcsvc]
        );
    
        res.json(newCSVC.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Update csvc
app.put("/updatecsvc/:id_csvc",async(req,res)=>{
    try {
        const {id_csvc} = req.params;
        const {ten_csvc, giatri, giathue_csvc, mieuta, soluong, anhcsvc} = req.body;
        const updateCsvc =await pool.query(
            "UPDATE cosovatchat SET ten_csvc = $1, giatri = $2, giathue_csvc = $3, mieuta = $4, soluong = $5, anhcsvc = $6 WHERE id_csvc = $7", 
            [ten_csvc, giatri, giathue_csvc, mieuta, soluong, anhcsvc, id_csvc]);
        
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
})

//Delete Csvc
app.delete("/deletecsvc/:id_csvc", async(req,res)=>{
    try {
        const {id_csvc} = req.params;
        const deleteCsvc = await pool.query("DELETE FROM cosovatchat WHERE id_csvc = $1",[id_csvc]);
    } catch (error) {
        console.error(error.message);
    }
    
    res.json("Deleted!");
})


//Get csvc from id_phong
app.get("/getcsvcfromnvh/:id_phong", async(req,res)=>{
    try {
        const {id_phong} = req.params;
        const account = await pool.query("SELECT * FROM cosovatchat JOIN phong USING(id_phong) WHERE id_phong = $1", [id_phong]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })


//Get csvc
app.get("/getcsvc/:id_csvc", async(req,res)=>{
    try {
        const {id_csvc} = req.params;
        const account = await pool.query("SELECT * FROM cosovatchat WHERE id_csvc = $1", [id_csvc]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })



//Thêm đơn đăng ký (bao gồm: Khách hàng, Csvcyeucau)
// INSERT INTO khachhang (id_kh, username, password, hotendem, ten, sdt, xa_phuong, quan_huyen, tinh_tp) VALUES ('001B', 'Le Van Vuong', '033527****');
// INSERT INTO dondk VALUES ('002', '001B', 'a', 2000, 'ABC', '0', DATE'2020-02-02', 0, 250, 'birday');
// INSERT INTO csvcyeucau VALUES (2, 6, 2, 'something');
// INSERT INTO csvcyeucau VALUES (2, 7, 5, 'something');
// INSERT INTO csvcyeucau VALUES (2, 8, 4, 'something');
// INSERT INTO csvcyeucau VALUES (2, 9, 2, 'something');

//Them Khach Hang
app.post("/addkhachhang", async(req,res)=>{
    try {
        const {username, password, hotendem, ten, sdt, xa_phuong, quan_huyen, tinh_tp} = req.body;
        const newKH = await pool.query(
            "INSERT INTO khachhang(username, password, hotendem, ten, sdt, xa_phuong, quan_huyen, tinh_tp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
            [username, password, hotendem, ten, sdt, xa_phuong, quan_huyen, tinh_tp]
        );
    
        res.json(newKH.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Tìm tài khoản và mật khẩu thỏa mãn (khách hàng)
app.post("/finduserclient", async(req,res)=>{
    try {
        // const {id_nvh} = req.params;
        const {username} = req.body;
        const newAccount = await pool.query(
            "SELECT id_kh FROM khachhang WHERE username = $1",
            [username]
        );
        console.log('req:', req.body);
        if (newAccount.rows.length!=0)
            res.send(true);
        else res.json(false);

    } catch (error) {
    console.log('error :', error.message);
    }
});

//Get khachhang
app.get("/getkh/:id_kh", async(req,res)=>{
    try {
        const {id_kh} = req.params;
        const account = await pool.query("SELECT * FROM khachhang WHERE id_kh = $1", [id_kh]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })

//Cap nhat khach hang
app.put("/updatekh/:id_kh",async(req,res)=>{
    try {
        const {id_kh} = req.params;
        const {hotendem, ten, sdt, tinh_tp, quan_huyen, xa_phuong, password, avatarkh} = req.body;
        const updateKh =await pool.query(`
            UPDATE khachhang SET 
                hotendem = $1, ten=$2, sdt=$3, tinh_tp=$4, quan_huyen=$5, xa_phuong=$6, password=$7, avatarkh=$8 WHERE id_kh = $9
        `, [hotendem, ten, sdt, tinh_tp, quan_huyen, xa_phuong, password, avatarkh,id_kh]);
        
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
})

//Them don dang ky
app.post("/adddondk", async(req,res)=>{
    try {
        const {id_kh, id_phong, pheduyet, ngaythue, time_start, time_finish, loinhan} = req.body;
        const newDonDk = await pool.query(
            "INSERT INTO dondk(id_kh, id_phong, pheduyet, ngaythue, time_start, time_finish, loinhan) VALUES ($1,$2,$3,$4,$5,$6, $7) RETURNING *",
            [id_kh, id_phong, pheduyet, ngaythue, time_start, time_finish, loinhan]
        );
    
        res.json(newDonDk.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Get dondk
app.get("/getdondk/:id_dondk", async(req,res)=>{
    try {
        const {id_dondk} = req.params;
        const account = await pool.query("SELECT * FROM dondk WHERE id_dondk = $1", [id_dondk]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })
//Get all dondk from id_nvh
app.get("/getdondkfromnvh/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const account = await pool.query(`
        SELECT * 
            FROM dondk 
                JOIN phong USING(id_phong)
                JOIN nhavanhoa USING(id_nvh)
                WHERE id_nvh = $1`, [id_nvh]);
   
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Phe duyet & hoidap dondk
app.put("/updatedondkpheduyet&hoidap/:id_dondk",async(req,res)=>{
    try {
        const {id_dondk} = req.params;
        const {pheduyet, hoidap} = req.body;
        const updatedondk =await pool.query("UPDATE dondk SET pheduyet = $1, hoidap=$2 WHERE id_dondk = $3", [pheduyet, hoidap,id_dondk]);
        
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
})

//Them Co So Vat Chat yeu cau
app.post("/addcsvcyeucau", async(req,res)=>{
    try {
        const {id_dondk, id_csvc, qty} = req.body;
        const newYC = await pool.query(
            "INSERT INTO csvcyeucau(id_dondk, id_csvc, qty) VALUES ($1,$2,$3) RETURNING *",
            [id_dondk, id_csvc, qty]
        );
    
        res.json(newYC.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Get csvcyeucau
app.get("/getcsvcyeucau/:id_dondk/:id_csvc", async(req,res)=>{
    try {
        const {id_dondk, id_csvc} = req.params;
        console.log('req :', req.params);
        const account = await pool.query("SELECT * FROM csvcyeucau WHERE id_dondk = $1 AND id_csvc = $2", [id_dondk, id_csvc]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })
//Get csvcyeucau from id_dondk
app.get("/getcsvcycfromdondk/:id_dondk", async(req,res)=>{
    try {
        const {id_dondk} = req.params;
        console.log('req :', req.params);
        const account = await pool.query(`
            SELECT * 
                FROM csvcyeucau
                JOIN dondk USING(id_dondk) 
                JOIN cosovatchat USING(id_csvc)
                WHERE id_dondk = $1`, [id_dondk]);
   
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get thong bao lien ket from id_nvh 
app.get("/getthongbaolienket/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        console.log('req :', req.params);
        const account = await pool.query(`
            SELECT count(id_admin) as thongbao FROM quanly WHERE root = '0' AND id_nvh = $1`, [id_nvh]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get thong bao don from id_nvh 
app.get("/getthongbaodon/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        console.log('req :', req.params);
        const account = await pool.query(`
        SELECT count(pheduyet) as thongbao FROM dondk
        JOIN phong USING(id_phong) WHERE pheduyet = '0' AND id_nvh = $1`, [id_nvh]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get tong thong bao from id_nvh 
app.get("/getthongbao/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        console.log('req :', req.params);
        const account = await pool.query(`
        select
        (SELECT count(id_admin) FROM quanly WHERE root = '0' AND id_nvh = $1)+
        (SELECT count(pheduyet) as thongbao FROM dondk
        JOIN phong USING(id_phong) WHERE pheduyet = '0' AND id_nvh = $1)
        as thong_bao`, [id_nvh]);
   
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })
//Get tat ca nhung admin muon lien ket tu id_nvh
app.get("/getadminmuonlienket/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        console.log('req :', req.params);
        const account = await pool.query(`
        SELECT * FROM quanly
        JOIN account USING(id_admin) WHERE root = '0' AND id_nvh = $1`, [id_nvh]);
   
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Phe duyet admin lien ket
   app.put("/pheduyetadminlienket/:id_nvh/:id_admin",async(req,res)=>{
    try {
        const {id_nvh, id_admin} = req.params;
        const {root} = req.body;
        const updatedondk =await pool.query("UPDATE quanly SET root=$1 WHERE id_nvh=$2 AND id_admin = $3", [root, id_nvh, id_admin]);
        console.log('pheduyetadminlienket :', req.params);
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
})

//Delete Csvc
app.delete("/deleteyeucaulienket/:id_admin/:id_nvh", async(req,res)=>{
    try {
        const {id_admin, id_nvh} = req.params;
        const deleteCsvc = await pool.query("DELETE FROM quanly WHERE id_admin = $1 AND id_nvh=$2",[id_admin, id_nvh]);
    } catch (error) {
        console.error(error.message);
    }
    
    res.json("Deleted!");
})

//Get all dondk from id_kh
app.get("/getdondkfromkh/:id_kh", async(req,res)=>{
    try {
        const {id_kh} = req.params;
        const account = await pool.query(`
        SELECT * 
            FROM dondk 
                JOIN phong USING(id_phong)
                JOIN khachhang USING(id_kh)
                WHERE id_kh = $1`, [id_kh]);
   
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all nhavanhoa va phong theo tinh thanh khach hang
app.get("/getallnvhvaphongtheokhachhang/:id_kh", async(req,res)=>{
    try {
        const {id_kh} = req.params;
        const account = await pool.query(`
        with diachi_kh as 
        (SELECT tinh_tp FROM khachhang WHERE id_kh = $1)
        SELECT * FROM nhavanhoa nvh join phong p on p.id_nvh=nvh.id_nvh WHERE tinh_tp = (SELECT dc.tinh_tp FROM diachi_kh dc)
        UNION ALL 
        SELECT * FROM nhavanhoa nvh join phong p on p.id_nvh=nvh.id_nvh WHERE tinh_tp != (SELECT tinh_tp FROM diachi_kh dc)
        `,[id_kh]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all nhavanhoa va phong co nhieu don dat hang nhat
app.get("/getallnvhvaphongtheodondat", async(req,res)=>{
    try {
        const account = await pool.query(`
        select * from phong 
            join nhavanhoa using(id_nvh) 
            order by so_don_dat desc; 
        `);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all nhavanhoa va phong 
app.get("/getallnvhvaphongtheososao", async(req,res)=>{
    try {
        const account = await pool.query(`
        select * from phong 
            join nhavanhoa using(id_nvh) 
            order by phong.so_sao_tb desc; 
        `);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all nhavanhoa va phong theo so binh luan
app.get("/getallnvhvaphongtheosobinhluan", async(req,res)=>{
    try {
        const account = await pool.query(`
        select * from nhavanhoa join
 (select phong.*, count(id_binh_luan) 
	from phong
	left join binhluan using(id_phong) 
	group by id_phong 
	order by count(id_binh_luan) desc) as b1 using(id_nvh) 
        `);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })



//Them binh luan
app.post("/addbinhluan/:id_phong/:id_kh", async(req,res)=>{
    try {
        const {id_kh, id_phong} = req.params;
        const {binh_luan, danh_gia_sao} = req.body;
        const newYC = await pool.query(
            "INSERT INTO binhluan(binh_luan, danh_gia_sao, id_phong, id_kh) VALUES ($1,$2,$3, $4) RETURNING *",
            [binh_luan, danh_gia_sao, id_phong, id_kh]
        );
    
        res.json(newYC.rows[0]);

        console.log('req:', req.body);

    } catch (error) {
    console.log('error :', error.message);
    }
})

//Get all dondk from id_nvh theo ngay thue
app.get("/getdondkfromnvhngaythue/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const account = await pool.query(`
        select * from dondk join phong using(id_phong) join nhavanhoa using(id_nvh) where id_nvh=$1 order by ngaythue desc;`, [id_nvh]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })
//Get tong tien duoc dat trong thang from id_nvh
app.get("/gettongtienduocdat/:id_nvh", async(req,res)=>{
    try {
        const {id_nvh} = req.params;
        const account = await pool.query(`
        select sum(tongtien) from dondk 
        join phong using(id_phong) 
        join nhavanhoa using(id_nvh)
        where (SELECT EXTRACT(MONTH FROM  ngaythue)) =  EXTRACT (MONTH FROM current_date) and id_nvh = $1;
        `, [id_nvh]);
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })

//Get all dondk from id_kh theo ngay thue
app.get("/getdondkfromkhngaythue/:id_kh", async(req,res)=>{
    try {
        const {id_kh} = req.params;
        const account = await pool.query(`
        select * from phong p join dondk dk using(id_phong) where id_kh=$1 order by ngaythue desc
`, [id_kh]);
        res.json(account.rows);
    } catch (error) {
        console.error(error.message);
    }
   })
//Get all dondk from id_kh theo tongtien
app.get("/getdondkfromkhtongtien/:id_kh", async(req,res)=>{
    try {
        const {id_kh} = req.params;
        const account = await pool.query(`
        select * from dondk join phong using(id_phong) join nhavanhoa using(id_nvh) where id_kh=$1 order by (tongtien) desc;
`, [id_kh]);
        res.json(account.rows);
        
    } catch (error) {
        console.error(error.message);
    }
   })

//Get tong tien tu id_kh trong thang
//Get all dondk from id_kh theo ngay thue
app.get("/gettongtientukhtrongthang/:id_kh", async(req,res)=>{
    try {
        const {id_kh} = req.params;
        const account = await pool.query(`
        select sum(tongtien) from dondk where (SELECT EXTRACT(MONTH FROM ngaythue)) = EXTRACT (MONTH FROM current_date) and id_kh = $1;
`, [id_kh]);
        res.json(account.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
   })



app.listen(5000, ()=>{
    console.log("Port: 5000"); 
})
