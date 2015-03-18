package com.css.sword.auth.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

/**
 * java序列化测试
 *
 */
public class Person implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	private String name;
	private String sex;
	private String phone;
	
	@Override
	public String toString() {
		return "name:" + this.name + "; sex:" + this.sex + "; phone:" + this.phone;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public static void main(String[] args) throws Exception {
		read();
	}
	
	public static void write() {
		File f = new File("d:/1.txt");
		FileOutputStream fos = null;
		ObjectOutputStream oos = null;
		try {   
	        fos = new FileOutputStream(f);   
	        Person p = new Person();
	        p.setName("elva");
	        p.setSex("nan");
	        p.setPhone("151");
	        oos = new ObjectOutputStream(fos);   
	        oos.writeObject(p);   
	    } catch (Exception e) {   
	        e.printStackTrace();   
	    } finally {   
	        if (oos != null) {   
	            try {   
	                oos.close();   
	            } catch (Exception e1) {   
	                e1.printStackTrace();   
	            }   
	        }   
	        if (fos != null) {   
	            try {   
	                fos.close();   
	            } catch (Exception e2) {   
	                e2.printStackTrace();   
	            }   
	        }   
	    }   
	}
	
	public static void read() {
		File f = new File("d:/1.txt");
		FileInputStream fis = null;
		ObjectInputStream ois = null;
		try {   
	        fis = new FileInputStream(f);   
	        ois = new ObjectInputStream(fis);   
	        Person p = (Person)ois.readObject();
	        System.out.println(p);
	    } catch (Exception e) {   
	        e.printStackTrace();   
	    } finally {   
	        if (ois != null) {   
	            try {   
	            	ois.close();   
	            } catch (Exception e1) {   
	                e1.printStackTrace();   
	            }   
	        }   
	        if (fis != null) {   
	            try {   
	                fis.close();   
	            } catch (Exception e2) {   
	                e2.printStackTrace();   
	            }   
	        }   
	    }   
	}
}
