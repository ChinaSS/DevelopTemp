package com.css.sword.org.test;

public class testMain {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String sql = "select * from table from";
		System.out.println(sql.indexOf("from"));
		System.out.println("select count(*) "+sql.substring(sql.indexOf("from")));
	}

}
