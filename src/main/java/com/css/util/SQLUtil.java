package com.css.util;

import java.util.ArrayList;
import java.util.List;

 /**
 * @Author weijy
 * sql工具类
 */
public class SQLUtil {
	
	/**
	* @Title: in
	* @Description: TODO(方法描述)
	* @param colunm 列名
	* @param list
	* @param size 分批大小
	* @return
	* @author weijy
	*/
	public static String in(String colunm, List<String> list, int size){
		return SQLUtil.in(colunm, list.toArray(new String[]{}), size);
	}
	
	/**
	* @Title: in
	* @Description: TODO(方法描述)
	* @param colunm 列名
	* @param arr 
	* @param size 分批大小
	* @return
	* @author weijy
	*/
	public static String in(String colunm, String[] arr, int size){
		return in(colunm, arr, size, "in");
	}
	
	/**
	* @Title: notIn
	* @Description: TODO(方法描述)
	* @param colunm
	* @param list
	* @param size
	* @return
	* @author weijy
	*/
	public static String notIn(String colunm, List<String> list, int size){
		return SQLUtil.notIn(colunm, list.toArray(new String[]{}), size);
	}
	
	/**
	* @Title: notIn
	* @Description: TODO(方法描述)
	* @param colunm
	* @param arr
	* @param size
	* @return
	* @author weijy
	*/
	public static String notIn(String colunm, String[] arr, int size){
		return in(colunm, arr, size, "not in");
	}
	
	private static String in(String colunm, String[] arr, int size, String flag){
		StringBuffer sb = new StringBuffer(); 
		sb.append(" and ( " + colunm + " " + flag + " ('')");
		if (arr != null && arr.length != 0) {
			if(arr.length <= 1000){
				sb.append(" or " + colunm + " " + flag + " (");
				for(int i=0;i<arr.length;i++){
					sb.append("'" + arr[i] + "'").append(
							i == arr.length - 1 ? "" : ",");
				}
				sb.append(")");
			}else{
				for (int i=0;i<arr.length;i++) {
					if (i % size == 0) {
						sb.append(" or " + colunm + " " + flag + " (");
					}
					sb.append("'" + arr[i] + "'");
					if (i % size == (size-1) || i == arr.length - 1) {
						sb.append(")");
					} else {
						sb.append(",");
					}
				}
			}
		}
		sb.append(" ) ");
		return sb.toString();
	}
	
	/*
	public static void writeClob() throws Exception{
		Session session = HibernateUtil.currentSession();
		HibernateUtil.openTransaction();
		PreparedStatement pstmt;
		String insert_sql = "insert into test_table(id, contents) values (?, empty_clob())";
		pstmt = session.connection().prepareStatement( insert_sql );
		String id = UUID.randomUUID().toString().replace("-", "");
		pstmt.setString(1, id);
		pstmt.execute();
		
		String query = "select contents from test_table where id = ? for update";
		pstmt = session.connection().prepareStatement( query );
		pstmt.setString(1, id);
		ResultSet rs = pstmt.executeQuery();
		rs.next();
		CLOB clob = (CLOB)rs.getClob("contents");
		BufferedWriter bw = new BufferedWriter(clob.getCharacterOutputStream());
		BufferedReader br = new BufferedReader(new FileReader(new File("c://a.txt")));
		String temp = br.readLine();
		while( temp!=null ){
			bw.write(temp);
			temp = br.readLine();
		}
		bw.flush();
		HibernateUtil.commitTransaction();
		br.close();
		bw.close();
		pstmt.close();
		HibernateUtil.closeSession();
	}
	
	public static void readClob() throws Exception{
		Session session = HibernateUtil.currentSession();
		PreparedStatement pstmt;
		String query = "select contents from test_table where id = ? ";
		pstmt = session.connection().prepareStatement( query );
		String id = "4fb55bdefe63406f80443cf33fbe2261";
		pstmt.setString(1, id);
		ResultSet rs = pstmt.executeQuery();
		rs.next();
		CLOB clob = (CLOB)rs.getClob("contents");
		BufferedReader br = new BufferedReader(clob.getCharacterStream());
		StringBuffer sb = new StringBuffer();
		String temp = br.readLine();
		while( temp!=null ){
			sb.append(temp + "\r\n");
			temp = br.readLine();
		}
		br.close();
		System.out.println(sb.toString());
		HibernateUtil.closeSession();
	}
	
	public static void writeBlob() throws Exception{
		Session session = HibernateUtil.currentSession();
		HibernateUtil.openTransaction();
		PreparedStatement pstmt;
		String insert_sql = "insert into test_table(id, files) values (?, empty_blob())";
		pstmt = session.connection().prepareStatement( insert_sql );
		String id = UUID.randomUUID().toString().replace("-", "");
		pstmt.setString(1, id);
		pstmt.execute();
		
		String query = "select files from test_table where id = ? for update";
		pstmt = session.connection().prepareStatement( query );
		pstmt.setString(1, id);
		ResultSet rs = pstmt.executeQuery();
		rs.next();
		BLOB blob = (BLOB)rs.getBlob("files");
		BufferedOutputStream bos = new BufferedOutputStream(blob.getBinaryOutputStream());
		BufferedInputStream bis = new BufferedInputStream(new FileInputStream("c://a.jpg"));
		byte[] bytes = new byte[1024];
		int count;
		while( (count = bis.read(bytes, 0, bytes.length))!=-1 ){
			bos.write(bytes);
		}
		bos.flush();
		bis.close();
		bos.close();
		
		HibernateUtil.commitTransaction();
		HibernateUtil.closeSession();
	}
	
	public static void readBlob() throws Exception{
		Session session = HibernateUtil.currentSession();
		PreparedStatement pstmt;
		String query = "select files from test_table where id = ? ";
		pstmt = session.connection().prepareStatement( query );
		String id = "afe94942060248d1b8794c1567a35f3f";
		pstmt.setString(1, id);
		ResultSet rs = pstmt.executeQuery();
		rs.next();
		BLOB blob = (BLOB)rs.getBlob("files");
		BufferedInputStream bis = new BufferedInputStream(blob.getBinaryStream());
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		byte[] bytes = new byte[1024];
		int temp;
		while( (temp=bis.read(bytes, 0, bytes.length))!=-1 ){
			bos.write(bytes);
		}
		bos.flush();
		bytes = bos.toByteArray();
		bis.close();
		bos.close();
		HibernateUtil.closeSession();
	}
	*/
	public static void main(String[] args) throws Exception {
		List<String> list = new ArrayList<String>();
		for(int i=0;i<1505;i++){
			list.add(i + "");
		}
		System.out.println(SQLUtil.notIn("code", list.toArray(new String[]{}), 300));
		//writeClob();
		//readClob();
		//writeBlob();
		//readBlob();
	}
}
