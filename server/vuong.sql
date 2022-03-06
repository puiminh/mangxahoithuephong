--5
select distinct csvc.* 
    from dondk 
        join csvcyeucau using(id_dondk) 
        join cosovatchat csvc using(id_csvc)
        where 
        (SELECT EXTRACT(MONTH FROM ngaythue)) = EXTRACT (MONTH FROM current_date);

--1
create or replace function dem_dat_phong() returns trigger as
$$
begin
 update phong
 set so_don_dat=(select count(id_dondk) from dondk where id_phong=NEW.id_phong)
 where id_phong=NEW.id_phong;
 RETURN NEW;
end;
$$
language plpgsql

create or replace trigger dem_don
after insert on dondk
for each row 
execute procedure dem_dat_phong();
--2
create or replace function dem_tong_don() returns trigger as
$$
begin
 update nhavanhoa
 set tong_don=(select sum(so_don_dat) from phong where id_nvh=NEW.id_nvh)
 where id_nvh=NEW.id_nvh;
 RETURN NEW;
end;
$$
language plpgsql

create or replace trigger dem_don_phong
after update on phong
for each row 
execute procedure dem_tong_don();