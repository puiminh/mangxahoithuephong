create table account(
	id_admin SERIAL,
	username varchar(20) NOT NULL,
	"password" varchar(20) NOT NULL,
	hotendem varchar(30) NOT NULL,
	ten varchar(30) NOT NULL,
	sdt varchar(10),
	diachi text,
	email varchar(50),
	facebook varchar(50),  	
	CONSTRAINT pk_admin PRIMARY KEY (id_admin)
);
create table khachhang(
	id_kh SERIAL,
	username varchar(20),
	"password" varchar(20),
	hotendem varchar(30) NOT NULL,
	ten varchar(30) NOT NULL,
	sdt varchar(10),
	diachi text,
	thon_xom varchar(30),
	xa_phuong varchar(30),
	quan_huyen varchar(30),
	tinh_tp varchar(30),
	CONSTRAINT pk_kh PRIMARY KEY (id_kh)
);
create table nhavanhoa(
	id_nvh SERIAL,
	ten_nvh varchar(50) NOT NULL,
	giathue int NOT NULL,
	diachi varchar(50) NOT NULL,
	thon_xom varchar(30) NOT NULL,
	xa_phuong varchar(30) NOT NULL,
	quan_huyen varchar(30) NOT NULL,
	tinh_tp varchar(30) NOT NULL,	
	avatar text DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQTEmYXYl5oyvm-q7slWLlhcVzFA2_3mvwbQ&usqp=CAU',
	bando text DEFAULT '...',
	dientich int DEFAULT 0,
	dientichnha int DEFAULT 0,
	dientichsan int DEFAULT 0,
	dientichkho int DEFAULT 0,
	gioithieu text,
	CONSTRAINT pk_nvh PRIMARY KEY (id_nvh)
);
create table quanly(
	id_nvh int NOT NULL,
	id_admin int NOT NULL,
	chucvu varchar(30),
	root char(1) NOT NULL,
	CONSTRAINT pk_quanly PRIMARY KEY (id_nvh, id_nvh),
	CONSTRAINT quanly_chk_root CHECK (root = '0' OR root = '1' OR root = '2'),
	CONSTRAINT quanly_fk_nhavanhoa FOREIGN KEY (id_nvh) REFERENCES nhavanhoa(id_nvh),
	CONSTRAINT quanly_fk_account FOREIGN KEY (id_admin) REFERENCES account(id_admin)
)
create table anhnvh(
	id_anhnvh SERIAL,
	id_nvh int NOT NULL,
	src text DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQTEmYXYl5oyvm-q7slWLlhcVzFA2_3mvwbQ&usqp=CAU',
	loai char(1) NOT NULL,
	chuthich text,
	CONSTRAINT pk_anhnvh PRIMARY KEY (id_anhnvh),
	CONSTRAINT anhnvh_fk_nhavanhoa FOREIGN KEY (id_nvh) REFERENCES nhavanhoa(id_nvh)
)
create table cosovatchat(
	id_csvc SERIAL,
	id_nvh int NOT NULL,
	ten_csvc varchar(30) NOT NULL,
	giatri int NOT NULL,
	giathue_csvc int NOT NULL, 	
	ngaybaohanh date,
	ghichubaotri text,
	anhcsvc text DEFAULT 'https://moodle.mtithrissur.ac.in/pluginfile.php/1/theme_moove/marketing3icon/1633675706/depositphotos_309341342-stock-illustration-house-maintenance-service-different-tools.jpg',
	mieuta text,
	soluong int NOT NULL,
	CONSTRAINT pk_csvc PRIMARY KEY (id_csvc),
	CONSTRAINT cosovatchat_fk_nhavanhoa FOREIGN KEY (id_nvh) REFERENCES nhavanhoa(id_nvh)
);

create table dondk(
	id_dondk SERIAL,
	id_kh int NOT NULL,
	id_nvh int NOT NULL,
	tongtien int,
	hoadon text,
	pheduyet char(1) NOT NULL, 	
	ngaythuebatdau date NOT NULL,
	ngaythueketthuc date NOT NULL,
	timestart int NOT NULL,
	timefinish int NOT NULL,
	sukien text,
	CONSTRAINT pk_dondk PRIMARY KEY (id_dondk),
	CONSTRAINT dondk_chk_pheduyet CHECK (pheduyet = '0' OR pheduyet = '1' OR pheduyet = '2'),
	CONSTRAINT dondk_fk_nhavanhoa FOREIGN KEY (id_nvh) REFERENCES nhavanhoa(id_nvh),
	CONSTRAINT dondk_fk_khachhang FOREIGN KEY (id_kh) REFERENCES khachhang(id_kh)
);
create table csvcyeucau(
	id_dondk int NOT NULL,
	id_csvc int NOT NULL,
	soluong int,
	ghichu text,
	CONSTRAINT pk_csvcyc PRIMARY KEY (id_csvc, id_dondk),
	CONSTRAINT csvcyeucau_fk_cosovatchat FOREIGN KEY (id_csvc) REFERENCES cosovatchat(id_csvc),
	CONSTRAINT csvcyeucau_fk_dondk FOREIGN KEY (id_dondk) REFERENCES dondk(id_dondk)	
);