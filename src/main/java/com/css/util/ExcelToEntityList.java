package com.css.util;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.LoggerFactory;


import ch.qos.logback.classic.Logger;

public class ExcelToEntityList {
	
	private Logger log = (Logger) LoggerFactory.getLogger(this.getClass());
	private BeanStorage storage = new BeanStorage();
	private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	private StringBuffer error = new StringBuffer(0);
	
	/**
	 * 
	 * @param param  包含headMapping信息已经前端传过来的扩展信息
	 * @param excel  
	 * @return
	 * @throws IOException
	 * @throws ClassNotFoundException 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public  <T> List<T>  transform(Map<String,String> param,InputStream excel) throws IOException, ClassNotFoundException, InstantiationException, IllegalAccessException{
		List<T> result = new ArrayList<T>();
		
		XSSFWorkbook book = new XSSFWorkbook(excel);
	    XSSFSheet sheet = book.getSheetAt(0);
	    int rowCount = sheet.getLastRowNum();
	    if(rowCount < 1){
			return new ArrayList<T>();
		}
	    //加载标题栏数据,以此和headMapping对应
	    Map<Integer, String> headTitle = loadHeadTitle(sheet);
	    //System.out.println(rowCount);
	    for(int i=1;i<=rowCount;i++){
	    	XSSFRow row = sheet.getRow(i);
			int cellCount = row.getLastCellNum();
			Class clazz = Class.forName(param.get("EntityClassName"));
			T instance = (T) clazz.newInstance();
			int col = 0;
			try {
		    	for(;col<cellCount;col++){
					String cellValue = getCellValue(row.getCell(col));
					if(null!=cellValue){
						this.setEntity(clazz, instance,param.get(headTitle.get(col)), cellValue);
					}
				}
				result.add(instance);
			} catch (Exception e) {
				excel.close();
				e.printStackTrace();
				this.error.append("第"+ (i+1) +"行，"+ headTitle.get(col)+"字段，数据错误，跳过！").append("<br>");
				log.error("第"+ (i+1) +"行，"+ headTitle.get(col)+"字段，数据错误，跳过！");
			}
	    }
	    excel.close();
	    return result;
	}
	
	/**
	 * 加载Excel的标题栏
	 * @param sheet
	 * @return 返回列序号和对于的标题名称Map
	 */
	private Map<Integer,String> loadHeadTitle(XSSFSheet sheet){
		Map<Integer,String> map = new HashMap<Integer, String>();
		XSSFRow row = sheet.getRow(0);
		int cellCount= row.getLastCellNum();
		for(int i = 0; i < cellCount; i++){
			String value = row.getCell(i).getStringCellValue();
			if(null == value){
				throw new RuntimeException("Excel导入：标题栏不能为空！");
			}
			map.put(i, value);
		}
		return map;
	}
	
	/**
	 * 获取表格列的值
	 * @param cell
	 * @return
	 */
	private String getCellValue(XSSFCell cell){
		if(null==cell){return "";}
		String value = null;
		switch (cell.getCellType()){
		case XSSFCell.CELL_TYPE_BOOLEAN:
			value = String.valueOf(cell.getBooleanCellValue());
			break;
		case XSSFCell.CELL_TYPE_NUMERIC:
			// 判断当前的cell是否为Date
			if (DateUtil.isCellDateFormatted(cell)){
				value = dateFormat.format(cell.getDateCellValue());
			}else{
				value = String.valueOf((long) cell.getNumericCellValue());
			}
			break;
		case XSSFCell.CELL_TYPE_STRING:
			value = cell.getStringCellValue();
			break;
		case XSSFCell.CELL_TYPE_FORMULA:
			log.debug("不支持函数！");
			break;
		}

		return value;
	}
	
	@SuppressWarnings("unchecked")
	private <T> void setEntity(Class clazz, T instance, String pro, String value) throws SecurityException, NoSuchMethodException, Exception{
		String innerPro = null;
		if (pro.contains(".")){
			String[] pros = pro.split("\\.");
			pro = pros[0];
			innerPro = pros[1];
			// 将成员变量的类型存储到仓库中
			storage.storeClass(instance.hashCode() + "", clazz.getDeclaredMethod(this.initGetMethod(pro), null).getReturnType());
		}
		String getMethod = this.initGetMethod(pro);
		Class type = clazz.getDeclaredMethod(getMethod, null).getReturnType();
		Method method = clazz.getMethod(this.initSetMethod(pro), type);
		if (type == String.class){
			method.invoke(instance, value);
		}else if (type == int.class || type == Integer.class){
			method.invoke(instance, Integer.parseInt("".equals(value) ? "0" : value));
		}else if (type == long.class || type == Long.class){
			method.invoke(instance, Long.parseLong("".equals(value) ? "0" : value));
		}else if (type == float.class || type == Float.class){
			method.invoke(instance, Float.parseFloat("".equals(value) ? "0" : value));
		}else if (type == double.class || type == Double.class){
			method.invoke(instance, Double.parseDouble("".equals(value) ? "0" : value));
		}else if (type == Date.class){
			method.invoke(instance, dateFormat.parse(value));
		}else if (type == boolean.class|| type == Boolean.class){
			method.invoke(instance, Boolean.parseBoolean("".equals(value) ? "false" : value));
		}else if (type == byte.class|| type == Byte.class){
			method.invoke(instance, Byte.parseByte(value));
		}else{
			// 引用类型数据
			Object ins = storage.getInstance(instance.hashCode() + "");
			this.setEntity(ins.getClass(), ins, innerPro, value);
			method.invoke(instance, ins);
		}
	}
	
	public String initSetMethod(String field)
	{
		return "set" + field.substring(0, 1).toUpperCase() + field.substring(1);
	}

	public String initGetMethod(String field)
	{
		return "get" + field.substring(0, 1).toUpperCase() + field.substring(1);
	}
	
	
	/**
	 * 
	 * @return true 存在错误，false 不存在错误
	 */
	public boolean hasError()
	{
		return error.capacity() > 0;
	}

	public StringBuffer getError()
	{
		return error;
	}
	/**
	 * 存储bean中的bean成员变量
	 * 
	 * @author 
	 * 
	 */
	private class BeanStorage
	{
		private Map<String, Object> instances = new HashMap<String, Object>();

		public void storeClass(String key, Class clazz) throws Exception{
			if (!instances.containsKey(key)){
				instances.put(key, clazz.newInstance());
			}
		}
		
		public Object getInstance(String key){
			return instances.get(key);
		}
	}
}	
