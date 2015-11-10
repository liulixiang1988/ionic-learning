<%@ page language="java" import="java.util.*,com.fiberhome.bcs.appprocess.common.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<aa:http id="img" url="http://www.exmobi.cn/images/common/qq-logo-dark.png"></aa:http>
<%
byte body[] = aa.rsp.getAttachBody("img");
sun.misc.BASE64Encoder encode =  new sun.misc.BASE64Encoder();
String base64 = encode.encode(body); 
System.out.println(base64);
%>
<%="data:image/png;base64,"+base64%>